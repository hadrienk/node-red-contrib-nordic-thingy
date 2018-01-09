/// <reference path="types/Thingy.d.ts" />
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

    private setupEuler(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.euler_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.euler_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupRotation(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.rotation_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.rotation_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupHeading(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.heading_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.heading_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupGravity(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.gravity_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.gravity_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupGravity(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.gravity_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.gravity_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupRaw(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.raw_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.raw_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupQuaternion(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.quaternion_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.quaternion_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupTap(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.tap_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.tap_disable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            }
        });
    }

    private setupStep(enabled: boolean, thingy: Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.stepCounter_enable(error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            } else {
                thingy.stepCounter_disable(error => {
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
            device: device,
            topic: type,
            payload: payload
        });
    }

    private removeThingy(thingy: Thingy): Promise<void> {

        const idx = this.thingies.indexOf(thingy);
        if (idx > -1)
            this.thingies.splice(idx, 1);

        this.updateStatus();

        thingy.removeAllListeners("orientationNotif");
        thingy.removeAllListeners("temperatureNotif");
        thingy.removeAllListeners("pressureNotif");
        thingy.removeAllListeners("humidityNotif");
        thingy.removeAllListeners("gasNotif");
        thingy.removeAllListeners("colorNotif");
        thingy.removeAllListeners("buttonNotif");
        thingy.removeAllListeners("tapNotif");
        thingy.removeAllListeners("quaternionNotif");
        thingy.removeAllListeners("stepCounterNotif");
        thingy.removeAllListeners("rawNotif");
        thingy.removeAllListeners("rotationNotif");
        thingy.removeAllListeners("headingNotif");
        thingy.removeAllListeners("gravityNotif");

        return new Promise((resolve, reject) => {
            thingy.disconnect(error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        })

    }

    public addThingy(thingy: Thingy): Promise<Thingy> {
        const configuration = this.configuration;

        thingy.once("disconnect", () => {
            this.removeThingy(thingy);
        });

        thingy.on("temperatureNotif", data => this.sendMessage(thingy, "temperature", data));
        thingy.on("pressureNotif", data => this.sendMessage(thingy, "pressure", data));
        thingy.on("humidityNotif", data => this.sendMessage(thingy, "humidity", data));
        thingy.on("gasNotif", data => this.sendMessage(thingy, "gas", data));
        thingy.on("colorNotif", data => this.sendMessage(thingy, "light", data));
        thingy.on("buttonNotif", data => this.sendMessage(thingy, "button", data));

        thingy.on("tapNotif", data => this.sendMessage(thingy, "tap", data));
        thingy.on("stepCounterNotif", data => this.sendMessage(thingy, "step", data));

        thingy.on("quaternionNotif", data => this.sendMessage(thingy, "quaternion", data));
        thingy.on("orientationNotif", data => this.sendMessage(thingy, "orientation", data));
        thingy.on("rawNotif", data => this.sendMessage(thingy, "raw", data));
        thingy.on("eulerNotif", data => this.sendMessage(thingy, "euler", data));
        thingy.on("rotationNotif", data => this.sendMessage(thingy, "rotation", data));
        thingy.on("headingNotif", data => this.sendMessage(thingy, "heading", data));
        thingy.on("gravityNotif", data => this.sendMessage(thingy, "gravity", data));

        return Promise.all([
            this.setupButton(configuration.button, thingy),
            this.setupGas(configuration.gas, thingy),
            this.setupPressure(configuration.pressure, thingy),
            this.setupHumidity(configuration.humidity, thingy),
            this.setupLight(configuration.light, thingy),
            this.setupTemperature(configuration.temperature, thingy),

            this.setupEuler(configuration.euler, thingy),
            this.setupRotation(configuration.rotation, thingy),
            this.setupHeading(configuration.heading, thingy),
            this.setupGravity(configuration.gravity, thingy),
            this.setupRaw(configuration.raw, thingy),
            this.setupQuaternion(configuration.quaternion, thingy),
            this.setupTap(configuration.tap, thingy),
            this.setupStep(configuration.step, thingy),

        ]).then(() => {
            this.thingies.push(thingy);
            this.updateStatus();
        });
    }

    constructor(node: ThingyNode, configuration: ThingyNodeProps) {
        this.node = node;
        this.configuration = configuration;
    }

    public ping(): Promise<> {
        return Promise.all(this.thingies.map(thingy => this.pingThingy(thingy)));
    }

    public removeAll() : Promise<void> {
        return Promise.all(this.thingies.map(thingy => this.removeThingy(thingy)));
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
}