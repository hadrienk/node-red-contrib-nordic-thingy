import * as nodered from "node-red";

import { ThingyManager } from "./ThingyManager";

import * as thingy52 from "thingy52";
import { ThingyNode, ThingyNodeProps } from "./ThingyNode";

/**
 * Scan for a device with timeout.
 * @param {(device: Thingy) => boolean} filter
 * @param {number} timeout
 * @returns {Promise<Thingy>}
 */
function discover(filter: (device: thingy52.Thingy) => boolean, timeout: number): Promise<thingy52.Thingy> {
    return new Promise((resolve, reject) => {

        const onDiscoverWithFilter = function(device: thingy52.Thingy) {
            if (filter(device)) {
                thingy52.stopDiscoverAll(onDiscoverWithFilter);
                resolve(device);
                clearTimeout(timeoutHandle);
            }
        };

        const timeoutHandle = setTimeout(() => {
            reject(new Error("timeout"));
            thingy52.stopDiscoverAll(onDiscoverWithFilter);
        }, timeout);

        // We want to get duplicates
        //thingy52.SCAN_DUPLICATES = true;
        thingy52.discoverAll(onDiscoverWithFilter);
    });
}

export = (RED: nodered.Red) => {

    RED.nodes.registerType("nordic-thingy", function (this: ThingyNode, props: ThingyNodeProps) {
        RED.nodes.createNode(this, props);

        this.manager = new ThingyManager(this, props);

        // Periodically scan for new thingies.
        const scanDelay = 5000;
        const timeout = 10000;

        const manager = this.manager;
        let scanHandle = setTimeout(function scan() {

            manager.updateStatus(true);

            discover(thingy => {
                // Ignore already connected thingy.
                const state = thingy._peripheral.state;
                if (["disconnected", "disconnecting"].indexOf(state) < 0)
                    return false;

                const name = thingy._peripheral.advertisement.localName;
                if (name.toLowerCase().indexOf("flokk") > -1)
                    return true;

                return false;

            }, timeout).then(thingy => {
                return new Promise<thingy52.Thingy>((resolve, reject) => {
                    thingy.connectAndSetUp(error => {
                        if (error)
                            reject(error);
                        else
                            resolve(thingy);
                    });
                }).then(thingy => manager.addThingy(thingy), undefined);
            }, reason => {
                console.debug("no thingy found: ", reason.toString());
            }).then(undefined, reason => {
                console.warn("could not connect to thingy: ", reason);
            }).then(() => {
                manager.updateStatus(false);
                scanHandle = setTimeout(scan, timeout);
            });

        }, scanDelay);

        this.on("close", done => {
            this.manager.removeAll().then(() => {
                    done();
                }, err => {
                    console.error("could not disconnect all nodes", err);
                    done();
                }
            ).then(() => {
                // Stop discovering.
                clearTimeout(scanHandle);

                this.manager = undefined;
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
