"use strict";
const ThingyManager_1 = require("./ThingyManager");
const thingy52 = require("thingy52");
/**
 * Scan for a device with timeout.
 * @param {(device: Thingy) => boolean} filter
 * @param {number} timeout
 * @returns {Promise<Thingy>}
 */
function discover(filter, timeout) {
    return new Promise((resolve, reject) => {
        const onDiscoverWithFilter = function (device) {
            if (filter(device)) {
                thingy52.stopDiscoverAll(onDiscoverWithFilter);
                clearTimeout(timeoutHandle);
                resolve(device);
            }
        };
        const timeoutHandle = setTimeout(() => {
            thingy52.stopDiscoverAll(onDiscoverWithFilter);
            reject(new Error("timeout"));
        }, timeout);
        thingy52.discoverAll(onDiscoverWithFilter);
    });
}
module.exports = (RED) => {
    RED.nodes.registerType("nordic-thingy", function (props) {
        RED.nodes.createNode(this, props);
        this.manager = new ThingyManager_1.ThingyManager(this, props);
        // Periodically scan for new thingies.
        const scanDelay = 5000;
        const timeout = 10000;
        const node = this;
        const manager = this.manager;
        let scanHandle = setTimeout(function scan() {
            manager.updateStatus(true);
            discover(thingy => {
                // Ignore already connected thingy.
                const state = thingy._peripheral.state;
                if (["disconnected", "disconnecting"].indexOf(state) < 0)
                    return false;
                const name = thingy._peripheral.advertisement.localName;
                return name.toLowerCase().indexOf("flokk") > -1;
            }, timeout).then(thingy => {
                return new Promise((resolve, reject) => {
                    thingy.connectAndSetUp(error => {
                        if (error)
                            reject(error);
                        else
                            resolve(thingy);
                    });
                }).then(thingy => {
                    if (this.manager)
                        manager.addThingy(thingy);
                }, undefined);
            }, reason => {
                node.debug("no thingy found: ", reason.toString());
            }).then(undefined, reason => {
                node.warn("could not connect to thingy: ", reason);
            }).then(() => {
                if (this.manager) {
                    manager.updateStatus(false);
                    scanHandle = setTimeout(scan, timeout);
                }
            });
        }, scanDelay);
        this.on("close", done => {
            const manager = this.manager;
            this.manager = null;
            clearTimeout(scanHandle);
            manager.removeAll().then(undefined, err => console.error("could not disconnect all nodes", err)).then(() => {
                // Stop discovering.
                manager.updateStatus(false);
                done();
            });
        });
    });
    RED.httpAdmin.post("/nordic-thingy/:id/ping", RED.auth.needsPermission("nordic-thingy.ping"), function (req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if (node.manager !== undefined) {
            const thingyNode = node;
            try {
                thingyNode.manager.ping().then(() => {
                    res.sendStatus(200);
                }).catch(error => {
                    res.sendStatus(500);
                    node.error(RED._("Ping failed", { error: error.toString() }));
                });
            }
            catch (err) {
                res.sendStatus(500);
                thingyNode.error(RED._("Ping failed", { error: err.toString() }));
            }
        }
        else {
            res.sendStatus(404);
        }
    });
};
//# sourceMappingURL=NodeThingy.js.map