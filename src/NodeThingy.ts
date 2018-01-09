import * as nodered from "node-red";

import { ThingyManager } from "./ThingyManager";
import { Thingy, ThingyNode, ThingyNodeProps } from "Thingy";

import * as thingyDevice from "thingy52";


// We want to get duplicates
thingyDevice.SCAN_DUPLICATES = false;

export = (RED: nodered.Red) => {

    RED.nodes.registerType("nordic-thingy", function (this: ThingyNode, props: ThingyNodeProps) {
        RED.nodes.createNode(this, props);

        this.manager = new ThingyManager(this, props);

        const discoverListener = (thingy: Thingy) => {
            const state = thingy._peripheral.state;
            if (["disconnected", "disconnecting"].indexOf(state) < 0)
                return;

            thingy.connectAndSetUp(error => {
                if (error) {
                    console.error("could not connect to ", thingy);
                } else {
                    this.manager.addThingy(thingy);
                    thingyDevice.stopDiscoverAll(discoverListener);
                }
            });
        }
        thingyDevice.discoverAll(discoverListener);

        this.on("close", done => {
            thingyDevice.stopDiscoverAll(discoverListener);

            this.manager.removeAll().then(() => {
                    done();
                }, err => {
                    console.error("could not disconnect all nodes", err);
                    done();
                }
            );

            this.manager = null;
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
