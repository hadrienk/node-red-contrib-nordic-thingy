import * as nodered from "node-red";

import { ThingyManager } from "./ThingyManager";

import * as thingy52 from "thingy52";
import { ThingyNode, ThingyNodeProps } from "./ThingyNode";


// We want to get duplicates
thingy52.SCAN_DUPLICATES = true;

export = (RED: nodered.Red) => {

    RED.nodes.registerType("nordic-thingy", function (this: ThingyNode, props: ThingyNodeProps) {
        RED.nodes.createNode(this, props);

        this.manager = new ThingyManager(this, props);

        const discoverListener = (thingy: thingy52.Thingy) => {
            const state = thingy._peripheral.state;
            if (["disconnected", "disconnecting"].indexOf(state) < 0)
                return;

            thingy.connectAndSetUp(error => {
                if (error) {
                    console.error("could not connect to ", thingy);
                } else {
                    this.manager.addThingy(thingy);
                    thingy52.stopDiscoverAll(discoverListener);
                }
            });
        };
        thingy52.discoverAll(discoverListener);

        this.on("close", done => {
            thingy52.stopDiscoverAll(discoverListener);

            this.manager.removeAll().then(() => {
                    done();
                }, err => {
                    console.error("could not disconnect all nodes", err);
                    done();
                }
            );

            this.manager = undefined;
        });

    });

    RED.httpAdmin.post("/nordic-thingy/:id/ping", RED.auth.needsPermission("nordic-thingy.ping"), function (req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if ((<ThingyNode>node).manager !== undefined) {
            const thingyNode = (<ThingyNode>node);
                try {
                    thingyNode.manager.ping().then(() => {
                        res.sendStatus(200);
                    }).catch(error => {
                        res.sendStatus(500);
                        node.error(RED._("Ping failed", {error: error.toString()}));
                    });
                } catch (err) {
                    res.sendStatus(500);
                    thingyNode.error(RED._("Ping failed", {error: err.toString()}));
                }
            } else {
                res.sendStatus(404);
            }
    });
};
