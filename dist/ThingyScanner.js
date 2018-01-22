"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thingy52 = require("thingy52");
const events_1 = require("events");
class ScanTimeout extends Error {
}
class ThingyScanner extends events_1.EventEmitter {
    constructor(filter, node) {
        super();
        this.scanDelay = 5000;
        this.timeout = 10000;
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
        this.discover = () => {
            return new Promise((resolve, reject) => {
                const onDiscoverWithFilter = (device) => {
                    if (this.cancelled) {
                        clearTimeout(this.timeoutHandle);
                        thingy52.stopDiscoverAll(onDiscoverWithFilter);
                    }
                    else {
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
        this.scan = () => {
            if (!this.cancelled) {
                this.emit("scanning", true);
                this.discover(this.filter).then(thingy => {
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
        if (filter === undefined)
            throw new Error("filter was undefined");
        if (node === undefined)
            throw new Error("filter was undefined");
        this.filter = filter;
        this.node = node;
    }
    start() {
        this.nextScanHandle = setTimeout(this.scan, 0);
    }
    stop() {
        this.cancelled = true;
        clearTimeout(this.nextScanHandle);
    }
}
exports.default = ThingyScanner;
//# sourceMappingURL=ThingyScanner.js.map