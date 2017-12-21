import * as nodered from "node-red";
import {ThingyManager} from "./ThingyManager";
import {Thingy} from "./types/Thingy";


interface ThingyNode extends nodered.Node {

    thingy: Thingy[];

    super();

}

interface ThingyNodeProps extends nodered.NodeProperties {
    config: nodered.NodeId;
}

const manager = new ThingyManager();

export = (RED: nodered.Red) => {
    // Register the module.

    // const clazz = ThingyNode;
    // RED.nodes.registerType("nordic-thingy", ThingyNode);
    // RED.nodes.registerType("nordic-thingy", clazz);

    RED.nodes.registerType("nordic-thingy", function (this: ThingyNode, props: ThingyNodeProps) {
        RED.nodes.createNode(this, props);

        const nodeConfiguration = RED.nodes.getNode(props.config);

        this.status({fill: "blue", shape: "dot", text: "scanning..."});
        manager.connect(this).then(([node, thingies]) => {
            this.status({fill: "green", shape: "dot", text: "connected"});
            this.thingy = thingies;
            for (const connectedThingy of thingies) {

                connectedThingy.on("disconnected", () => {
                    // you can be notified of disconnects
                    this.thingy = undefined;
                    this.status({fill: "blue", shape: "dot", text: "scanning..."});
                });

                connectedThingy.euler_enable(error => {
                    this.error("could not enable euler sensor", {payload: error});
                });
                connectedThingy.on("eulerNotif", data => {
                    this.send({device: connectedThingy, payload: data});
                });

                connectedThingy.on("orientationNotif", data => {
                    this.send({device: connectedThingy, payload: data});
                });

                connectedThingy.on("rawNotif", data => {
                    // you can be notified of disconnects
                    this.send({device: connectedThingy, payload: data});
                });
            }
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
                for (const thingy of node.thingy) {
                    node.log("set mode");
                    thingy.speaker_mode_set(3, () => {
                        node.log("set mode done");
                        const data = new Buffer(1);
                        data.set([1]);
                        node.log("write");
                        thingy.speaker_pcm_write(data, () => {
                            node.log("write done");
                            res.sendStatus(200);
                        });
                    });
                }
            } catch (err) {
                res.sendStatus(500);
                node.error(RED._("Ping failed", {error: err.toString()}));
            }
        } else {
            res.sendStatus(404);
        }
    });
};
