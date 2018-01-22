import * as nodered from "node-red";

import { ThingyManager } from "./ThingyManager";
import { ThingyNode, ThingyNodeProps } from "./ThingyNode";
import ThingyScanner from "./ThingyScanner";

export = (RED: nodered.Red) => {

    RED.nodes.registerType("nordic-thingy", function (this: ThingyNode, props: ThingyNodeProps) {
        RED.nodes.createNode(this, props);

        this.manager = new ThingyManager(this, props);

        // Periodically scan for new thingies.
        const scanDelay = 5000;
        const timeout = 10000;

        const scanner = new ThingyScanner(device => {
            const name = device._peripheral.advertisement.localName;
            return name.toLowerCase().indexOf("flokk") > -1;
        }, this);

        scanner.on("scanning", () => this.manager.updateStatus(true));
        scanner.on("done", () => this.manager.updateStatus(false));
        scanner.on("discovered", thingy => this.manager.addThingy(thingy).then(() => this.manager.updateStatus(false)));
        scanner.start();

        this.on("close", done => {
            scanner.stop();
            this.manager.removeAll().then(undefined, err => console.error("could not disconnect all nodes", err))
                .then(() => {
                // Stop discovering.
                this.manager.updateStatus(false);
                done();
            });
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
