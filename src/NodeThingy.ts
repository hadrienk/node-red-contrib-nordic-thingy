import * as nodered from "node-red";
import * as Thingy from "thingy52";


interface ThingyNode extends nodered.Node {
    thingy: any;

    super();
}

abstract class TestNode implements ThingyNode {
    ping() {
        this.log("blabla");
    }
}
interface ThingyNodeProps extends nodered.NodeProperties {
    config: nodered.NodeId;
}


export = (RED: nodered.Red) => {
    // Register the module.

    // const clazz = ThingyNode;
    // RED.nodes.registerType("nordic-thingy", ThingyNode);
    // RED.nodes.registerType("nordic-thingy", clazz);

    RED.nodes.registerType("nordic-thingy", function (this: TestNode, props: ThingyNodeProps) {

        RED.nodes.createNode(this, props);
        const config = RED.nodes.getNode(props.config);

        this.status({fill: "blue", shape: "dot", text: "scanning..."});

        Thingy.discover(thingy => {

            if (!thingy) {
                this.error("invalid thingy instance");
                return;
            }

            this.status({fill: "yellow", shape: "dot", text: "connecting..."});

            // you'll need to call connect and set up
            thingy.connectAndSetUp(error => {

                if (error) {
                    this.error("could not setup thingy connection");
                    return;
                }

                this.status({fill: "green", shape: "dot", text: "connected"});

                this.thingy = thingy;

                // you can be notified of disconnects
                thingy.on("disconnect", _ => {
                    this.thingy = undefined;
                    this.status({fill: "blue", shape: "dot", text: "scanning..."});
                });

                thingy.on("rawNotif", data => {
                    this.send({
                        payload: data
                    });
                });

                thingy.raw_enable(error => this.error("could not enable raw"));
            });
        });

        this.log("Something fantastic happened.");
        this.warn("Something exceptional happened.");
        this.error("Something disastrous happened when I tried to process this.", {payload: "Cookies"});
        this.debug("A behind the scenes look.");
        this.trace("A look behind the scenes, under the floor.");
        this.status({fill: "red", shape: "dot", text: "status"});
        this.status({});
        this.send({payload: "Milk"});
        this.send([[
            {payload: "FirstMessageFirstNode"},
            {payload: "SecondMessageFirstNode"},
        ], {payload: "MessageSecondNode"}]);

        this.on("close", () => {
            this.debug("disconnecting the thingy");
            this.thingy.disconnect();
        });
    });

    RED.httpAdmin.post("/nordic-thingy/:id/ping", RED.auth.needsPermission("thingy.ping"), function (req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if (node != undefined && node.thingy != undefined) {
            try {
                const thingy = node.thingy;
                node.log("set mode");
                thingy.speaker_mode_set(3, _ => {
                    node.log("set mode done");
                    const data = new Buffer(1);
                    data.set([1]);
                    node.log("write");
                    thingy.speaker_pcm_write(data, _ => {
                        node.log("write done");
                        res.sendStatus(200);
                    });
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
