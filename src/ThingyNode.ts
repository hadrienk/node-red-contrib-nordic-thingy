import * as nodered from "node-red";
import { ThingyManager } from "./ThingyManager";

export interface ThingyNode extends nodered.Node {
    manager: ThingyManager;
}

export interface ThingyNodeProps extends nodered.NodeProperties {
    config: nodered.NodeId;

    battery: boolean;
    rssi: boolean;
    temperature: boolean;
    gas: boolean;
    pressure: boolean;
    humidity: boolean;
    light: boolean;
    button: boolean;

    euler: boolean;
    rotation: boolean;
    heading: boolean;
    gravity: boolean;
    raw: boolean;
    quaternion: boolean;
    tap: boolean;
    step: boolean;
}

