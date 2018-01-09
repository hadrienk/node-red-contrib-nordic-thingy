import * as nodered from "node-red";
import {ThingyManager} from "./ThingyManager";

import * as thingyDevice from "thingy52";
// We want to get duplicates
thingyDevice.SCAN_DUPLICATES = true;


interface ThingyNode extends nodered.Node {
    manager: ThingyManager;
}

interface ThingyNodeProps extends nodered.NodeProperties {
    config: nodered.NodeId;
    temperature: boolean;
    gas: boolean;
    pressure: boolean;
    humidity: boolean;
    light: boolean;
    button: boolean;

    euler: boolean;
    rotation: boolean;
    heading: boolean;
    gravity: boolean;
    raw: boolean;
    quaternion: boolean;
    tap: boolean;
    step: boolean;
}

export = (RED: nodered.Red) => {

    // class Test extends Node {
    //
    //     static id = 0;
    //
    //     id: number;
    //
    //     constructor(config) {
    //         super();
    //         this.id = ++Test.id;
    //     }
    //
    //     ping() {
    //         console.log(`ping, id ${this.id}`);
    //     }
    //
    //     close(destroy) {
    //         console.log(`called close, id ${this.id}, destroy ${destroy}`);
    //     }
    // }
    //
    // // Register the module.
    // RED.nodes.registerType("nordic-thingy", Test, RED);
    //
    // RED.httpAdmin.post("/nordic-thingy/:id/ping", RED.auth.needsPermission("nordic-thingy.ping"), function (req, res) {
    //     const node = RED.nodes.getNode(req.params.id);
    //     node.ping();
    // });

    // const clazz = ThingyNode;
    // RED.nodes.registerType("nordic-thingy", ThingyNode);
    // RED.nodes.registerType("nordic-thingy", clazz);

    let n = 0;

    RED.nodes.registerType("nordic-thingy", function (this: ThingyNode, props: ThingyNodeProps) {
        RED.nodes.createNode(this, props);

        this.test = ++n;

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
        if (node != undefined && node.manager != undefined) {
            try {
                node.manager.ping().then(() => {
                    res.sendStatus(200);
                }).catch(error => {
                    res.sendStatus(500);
                    node.error(RED._("Ping failed", {error: error.toString()}));
                });
            } catch (err) {
                res.sendStatus(500);
                node.error(RED._("Ping failed", {error: err.toString()}));
            }
        } else {
            res.sendStatus(404);
        }
    });
};
