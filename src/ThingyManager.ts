import * as nodered from "node-red";
/// <reference path="types/Thingy.d.ts" />
import * as thingyDevice from "thingy52";
import {Thingy} from "./types/Thingy";


/**
 * A manager class that binds the thingy and the node-red nodes.
 */
export class ThingyManager {

    private configuration: ThingyNodeProps;
    private node: ThingyNode;
    private thingies: Thingy[] = [];

    private setupTemperature(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.temperature_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.button_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupGas(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.gas_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.gas_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupPressure(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.pressure_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.pressure_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupHumidity(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.humidity_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.humidity_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupLight(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.color_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.color_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupButton(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.button_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.button_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private pingThingy(thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            thingy.speaker_mode_set(3, error => {
                if (error) {
                    reject(error);
                } else {
                    const data = new Buffer(1);
                    data.set([1]);
                    thingy.speaker_pcm_write(data, error => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    }

    private sendMessage(device: Thingy, type: string, payload: any): void {
        this.node.send({
            device: device.id,
            type: type,
            payload: payload
        });
    }

    private addThingy(thingy: Thingy): Promise<Thingy> {
        const configuration = this.configuration;

        thingy.on("eulerNotif", data => this.sendMessage(thingy, "euler", data));
        thingy.on("orientationNotif", data => this.sendMessage(thingy, "orientation", data));
        thingy.on("temperatureNotif", data => this.sendMessage(thingy, "temperature", data));
        thingy.on("pressureNotif", data => this.sendMessage(thingy, "pressure", data));
        thingy.on("humidityNotif", data => this.sendMessage(thingy, "humidity", data));
        thingy.on("gasNotif", data => this.sendMessage(thingy, "gas", data));
        thingy.on("colorNotif", data => this.sendMessage(thingy, "light", data));
        thingy.on("buttonNotif", data => this.sendMessage(thingy, "button", data));
        thingy.on("tapNotif", data => this.sendMessage(thingy, "tap", data));
        thingy.on("quaternionNotif", data => this.sendMessage(thingy, "quaternion", data));
        thingy.on("stepCounterNotif", data => this.sendMessage(thingy, "step", data));
        thingy.on("rawNotif", data => this.sendMessage(thingy, "raw", data));
        thingy.on("rotationNotif", data => this.sendMessage(thingy, "rotation", data));
        thingy.on("headingNotif", data => this.sendMessage(thingy, "heading", data));
        thingy.on("gravityNotif", data => this.sendMessage(thingy, "gravity", data));

        return Promise.all([
            this.setupButton(configuration.button, thingy),
            this.setupGas(configuration.gas, thingy),
            this.setupPressure(configuration.pressure, thingy),
            this.setupHumidity(configuration.humidity, thingy),
            this.setupLight(configuration.light, thingy),
            this.setupTemperature(configuration.temperature, thingy)
        ]).then(() => thingy);
    }

    constructor(node: ThingyNode, configuration: ThingyNodeProps) {
        this.node = node;
        this.configuration = configuration;
    }

    public ping(): Promise<> {
        return Promise.all(this.thingies.map(thingy => this.pingThingy(thingy)));
    }

    public disconnect() {
        for (const thingy of this.thingies)
            thingy.disconnect();
    }

    private updateStatus() {
        // TODO: errors.
        const count = this.thingies.length;
        if (count == 0) {
            this.node.status({fill: "blue", shape: "dot", text: "scanning..."});
        } else {
            if (count > 1) {
                this.node.status({fill: "green", shape: "dot", text: `${count} thingies connected`});
            } else {
                this.node.status({fill: "green", shape: "dot", text: "1 thingy connected"});
            }
        }
    }

    public connect(filter?: any): void {
        return new Promise((resolve, reject) => {
            thingyDevice.discoverAll((thingy: Thingy) => {
                this.updateStatus();
                thingy.connectAndSetUp(error => {
                    if (error) {
                        reject(error);
                    } else {
                        this.addThingy(thingy).then(thingy => {
                            this.thingies.push(thingy);
                            this.updateStatus();
                            resolve();
                        }).catch(error => {
                            node.warn(`could not connect to thingy ${thingy.address}`, error);
                        });
                    }
                });
            });
        });
    }
}
