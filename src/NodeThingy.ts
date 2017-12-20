import * as nodered from "node-red";
import Thingy from "thingy52";


interface ThingyNode extends nodered.Node {
}

interface ThingyNodeProps extends nodered.NodeProperties {
}

export = (RED: nodered.Red) => {
    // Register the module.
    RED.nodes.registerType("nordic-thingy", function (this: ThingyNode, props: ThingyNodeProps) {
        RED.nodes.createNode(this, props);
        const config = RED.nodes.getNode(props.config);
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
            this.someResource.close();
        });

        Thingy.discover();
    });
};
