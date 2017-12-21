import * as nodered from "node-red";
/// <reference path="types/Thingy.d.ts" />
import * as thingyDevice from "thingy52";
import {Thingy} from "./types/Thingy";


/**
 * A manager class that binds the thingy and the node-red nodes.
 */
export class ThingyManager {

    /**
     * Connects a node to a Thingy
     * @param {Node} node
     * @param filter
     * @returns {Promise<[nodered.Node, Thingy]>}
     */
    public connect(node: nodered.Node, filter?: any): Promise<[nodered.Node, Thingy[]]> {
        node.debug("scanning...");
        return new Promise((resolve, reject) => {
            thingyDevice.discover((thingy: Thingy) => {
                node.debug(`connecting...`);
                thingy.connectAndSetUp(error => {
                    if (error) {
                        reject(error);
                    } else {
                        // const binding = [node, thingy];
                        // this.addBinding(binding);
                        // this.addThingy(thingy);
                        resolve([node, [thingy]]);
                    }
                });
            });
        });
    }
}
