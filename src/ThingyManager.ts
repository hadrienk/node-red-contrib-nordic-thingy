import * as nodered from "node-red";
import * as thingy52 from "thingy52";
import * as colorConvert from "color-convert";
import { ThingyNode, ThingyNodeProps } from "./ThingyNode";
import Timer = NodeJS.Timer;

/**
 * A manager class that binds the thingy and the node-red nodes.
 */
export class ThingyManager {

    private configuration: ThingyNodeProps;
    private node: ThingyNode;
    private thingies: thingy52.Thingy[] = [];

    private rssiUpdateHandle: Timer;

    private setupCustom(thingy: thingy52.Thingy): Promise<ThingyManager> {
        const THINGY_MOTION_SERVICE =    "ef6804009b3549339b1052ffa9740042";
        const STATE_CHARACTERISTIC =     "ef68040b9b3549339b1052ffa9740042";
        const LOW_POWER_CHARACTERISTIC = "ef68040c9b3549339b1052ffa9740042";

        const custom_characteristics = [{
            service: THINGY_MOTION_SERVICE,
            characteristic: STATE_CHARACTERISTIC
        }, {
            service: THINGY_MOTION_SERVICE,
            characteristic: LOW_POWER_CHARACTERISTIC
        }];

        const promises = [];
        for (const {service, characteristic} of custom_characteristics) {
            const promise = this.setupNotify(thingy, service, characteristic).catch(reason => {
                this.node.error(`could not listen for ${service}:${characteristic}`);;
            });
            promises.push(promise);
        }

        return Promise.all(promises).then(value => this);
    }

    private setupNotify(thingy: thingy52.Thingy, service: string, characteristic: string) {
        return new Promise<ThingyManager>((resolve, reject) => {
            thingy.notifyCharacteristic(
                service,
                characteristic,
                true,
                (data: any) => {
                    this.sendMessage(thingy, characteristic, data);
                },
                (error: any) => {
                    if (error)
                        reject(error);
                    else
                        resolve(this);
                }
            );
        });
    }

    private setupRssi(enabled: boolean, interval: number, thingy: thingy52.Thingy): Promise<ThingyManager> {
        return new Promise<ThingyManager>(resolve => {
            if (enabled) {
                this.rssiUpdateHandle = setInterval(() => {
                    thingy._peripheral.updateRssi((error, rssi) => {
                        if (error)
                            this.node.error("error updating the rssi value");
                        else
                            this.sendMessage(thingy, "rssi", rssi);
                    });
                }, interval);
            } else {
                clearInterval(this.rssiUpdateHandle);
            }
            resolve();
        });
    }

    private setupBattery(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            if (enabled) {
                thingy.notifyBatteryLevel(error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            } else {
                thingy.unnotifyBatteryLevel(error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });

            }
        });
    }

    private setupTemperature(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupGas(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupPressure(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupHumidity(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupLight(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupButton(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupEuler(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupRotation(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupHeading(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupGravity(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupRaw(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupQuaternion(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupTap(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    private setupStep(enabled: boolean, thingy: thingy52.Thingy): Promise<any> {
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

    /**
     * Set the color of the thingy.
     *
     * @param {Thingy} thingy
     * @param {string} color in hex format, ex. #FF00EE
     * @returns {Promise<ThingyManager>}
     */
    private setLedColor(thingy: thingy52.Thingy, color: string): Promise<ThingyManager> {
        return new Promise<ThingyManager>((resolve, reject) => {
            const [r, g, b] = colorConvert.hex.rgb(color);
            thingy.led_set({r, g, b}, error => {
                if (!error) {
                    resolve(this);
                } else {
                    reject(error);
                }
            });
        });
    }

    private pingThingy(thingy: thingy52.Thingy): Promise<any> {
        return new Promise((resolve, reject) => {
            thingy.speaker_mode_set(3, error => {
                if (error) {
                    reject(error);
                } else {
                    const data = new Buffer(1);
                    data.set([0]);
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

    private sendMessage(device: thingy52.Thingy, type: string, payload: any): void {
        this.node.send({
            device: device,
            topic: type,
            payload: payload
        });
    }

    private removeThingy(thingy: thingy52.Thingy): Promise<void> {

        const idx = this.thingies.indexOf(thingy);
        if (idx > -1)
            this.thingies.splice(idx, 1);

        this.updateStatus();

        // TODO: Make update rate dynamic.
        this.setupRssi(false, 1000, thingy),

        thingy.removeAllListeners("batteryLevelChange");
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
        });

    }

    public addThingy(thingy: thingy52.Thingy): Promise<thingy52.Thingy> {
        const configuration = this.configuration;

        thingy.once("disconnect", () => {
            this.removeThingy(thingy);
        });



        thingy.on("batteryLevelChange", data => this.sendMessage(thingy, "battery", data));
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
        thingy.on("rawNotif", data => {
            this.sendMessage(thingy, "accelerometer", data.accelerometer);
            this.sendMessage(thingy, "compass", data.compass);
            this.sendMessage(thingy, "gyroscope", data.gyroscope);
        });
        thingy.on("eulerNotif", data => this.sendMessage(thingy, "euler", data));
        thingy.on("rotationNotif", data => this.sendMessage(thingy, "rotation", data));
        thingy.on("headingNotif", data => this.sendMessage(thingy, "heading", data));
        thingy.on("gravityNotif", data => this.sendMessage(thingy, "gravity", data));

        return Promise.all([

            // Bug in the thingy lib. Need to enable first to avoid error.
            this.setupBattery(true, thingy).then(() => {
                return this.setupBattery(this.configuration.battery, thingy);
            }),

            this.setupCustom(thingy),
            // TODO: Make update rate dynamic.
            this.setupRssi(configuration.rssi, 1000, thingy),

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
            return thingy;
        });
    }

    constructor(node: ThingyNode, configuration: ThingyNodeProps) {
        this.node = node;
        this.configuration = configuration;
    }

    public ping(): Promise<thingy52.Thingy[]> {
        return Promise.all(this.thingies.map(thingy => this.pingThingy(thingy)));
    }

    public removeAll(): Promise<void> {
        return Promise.all(this.thingies.slice().map(thingy => this.removeThingy(thingy))).then(() => {});
    }

    public updateStatus(scanning: boolean = false) {
        const count = this.thingies.length;
        if (count == 0) {
            this.node.status({fill: "blue", shape: "dot", text: `no thingy found${scanning ? "(scanning)" : ""}` });
        } else {
            if (count > 1) {
                this.node.status({fill: "green", shape: "dot", text: `${count} thingies connected${scanning ? "(scanning)" : ""}`});
            } else {
                this.node.status({fill: "green", shape: "dot", text: `${count} thingy connected ${scanning ? "(scanning)" : ""}`});
            }
        }
    }
}
