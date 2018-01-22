import * as thingy52 from "thingy52";
import { EventEmitter } from "events";
import Timer = NodeJS.Timer;
import { ThingyNode } from "./ThingyNode";

export type Filter = (device: thingy52.Thingy) => boolean;

class ScanTimeout extends Error {}

interface ThingyScannerEmmiter {
    on(event: "scanning" | symbol, listener: () => void): this;
    on(event: "done" | symbol, listener: () => void): this;
    on(event: "discovered" | symbol, listener: (thingy: thingy52.Thingy) => void): this;
}

export default class ThingyScanner extends EventEmitter implements ThingyScannerEmmiter {

    private filter: Filter;
    private cancelled: boolean;
    private scanDelay = 5000;
    private timeout = 10000;

    private timeoutHandle: Timer;
    private nextScanHandle: Timer;

    private node: ThingyNode;

    constructor(filter: Filter, node: ThingyNode ) {
        super();
        if (filter === undefined) throw new Error("filter was undefined");
        if (node === undefined) throw new Error("filter was undefined");
        this.filter = filter;
        this.node = node;
    }

    /**
     * Discover a thingy.
     *
     * Returns a Promise that will be resolved with a Thingy.
     * It can also fail with ScanTimeout or any other error the
     * pairing process throws.
     *
     * @param {Filter} filter the device filter.
     * @returns {Promise<thingy52.Thingy>}
     */
    discover = (): Promise<thingy52.Thingy> => {
        return new Promise((resolve, reject) => {
            const onDiscoverWithFilter = (device: thingy52.Thingy) => {
                if (this.cancelled) {
                    clearTimeout(this.timeoutHandle);
                    thingy52.stopDiscoverAll(onDiscoverWithFilter);
                } else {
                    if (this.filter(device)) {
                        clearTimeout(this.timeoutHandle);
                        thingy52.stopDiscoverAll(onDiscoverWithFilter);
                        device.connectAndSetUp(error => {
                            if (error)
                                reject(error);
                            else
                                resolve(device);
                        });
                    }
                }
            };

            this.timeoutHandle = setTimeout(() => {
                thingy52.stopDiscoverAll(onDiscoverWithFilter);
                reject(new ScanTimeout("timeout"));
            }, this.timeout);

            thingy52.discoverAll(onDiscoverWithFilter);
        });
    };

    scan = () => {
        if (!this.cancelled) {
            this.emit("scanning", true);
            this.discover().then(thingy => {
                this.emit("discovered", thingy);
            }, error => {
                if (error instanceof ScanTimeout)
                    this.node.debug("timed out");
                else
                    this.node.error("could not connect to the thingy" + error.toString());
            }).then(() => {
                this.emit("done", true);
                if (!this.cancelled) {
                    this.nextScanHandle = setTimeout(this.scan, this.scanDelay);
                }
            });
        }
    };

    public start() {
        this.nextScanHandle = setTimeout(this.scan, 0);
    }

    public stop() {
        this.cancelled = true;
        clearTimeout(this.nextScanHandle);
    }

}
