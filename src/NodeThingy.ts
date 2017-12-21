import * as nodered from "node-red";
import {ThingyManager} from "./ThingyManager";


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
}

const manager = new ThingyManager();

export = (RED: nodered.Red) => {
    // Register the module.

    // const clazz = ThingyNode;
    // RED.nodes.registerType("nordic-thingy", ThingyNode);
    // RED.nodes.registerType("nordic-thingy", clazz);

    RED.nodes.registerType("nordic-thingy", function (this: ThingyNode, props: ThingyNodeProps) {
        RED.nodes.createNode(this, props);

        this.manager = new ThingyManager(this, props);
        this.manager.connect();


        this.on("close", () => {
            this.debug("disconnecting the thingy");
            this.manager.disconnect();
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
