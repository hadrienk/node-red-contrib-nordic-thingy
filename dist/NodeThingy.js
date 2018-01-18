"use strict";
const ThingyManager_1 = require("./ThingyManager");
const thingy52 = require("thingy52");
// We want to get duplicates
thingy52.SCAN_DUPLICATES = true;
module.exports = (RED) => {
    RED.nodes.registerType("nordic-thingy", function (props) {
        RED.nodes.createNode(this, props);
        this.manager = new ThingyManager_1.ThingyManager(this, props);
        const discoverListener = (thingy) => {
            const state = thingy._peripheral.state;
            if (["disconnected", "disconnecting"].indexOf(state) < 0)
                return;
            thingy.connectAndSetUp(error => {
                if (error) {
                    console.error("could not connect to ", thingy);
                }
                else {
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
            }).then(() => this.manager = undefined);
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