import { NobleDevice } from "./NobleDevice";
import {ThingyManager} from "../ThingyManager";
import * as nodered from "node-red";

export type ButtonState = "Pressed" | "Released";

export type ErrorHandler = (error: any) => void;
export type Listener<T> = (data: T, ...args: any[]) => void;

export type StepData = { steps: number, time: number };
export type TapData = { direction: number, count: number };
export type LightData = { red: number, green: number, blue: number, clear: number };
export type GasData = { eco2: number, tvoc: number };
export type QuaternionData = { w: number, x: number, y: number, z: number };
export type EulerData = { roll: number, pitch: number, yaw: number };
export type Coordinate = { x: number, y: number, z: number };
export type RawData = { accelerometer: Coordinate, gyroscope: Coordinate, compass: Coordinate };
export type OrientationData = number;
export type RotationData = {
    m_11: number, m_12: number, m_13: number,
    m_21: number, m_22: number, m_23: number,
    m_31: number, m_32: number, m_33: number,
};

export type GravityData = Coordinate;

export interface ThingyNode extends nodered.Node {
    manager: ThingyManager;
}

export interface ThingyNodeProps extends nodered.NodeProperties {
    config: nodered.NodeId;
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

export interface Thingy extends NobleDevice {

    on(event: string | symbol, listener: (...args: any[]) => void): this;

    on(event: "orientationNotif", listener: Listener<OrientationData>): this;

    on(event: "temperatureNotif", listener: (temperature: number) => void): this;

    on(event: "pressureNotif", listener: (pressure: number) => void): this;

    on(event: "humidityNotif", listener: (humidity: number) => void): this;

    on(event: "gasNotif", listener: (data: GasData) => void): this;

    on(event: "colorNotif", listener: Listener<LightData>): this;

    on(event: "buttonNotif", listener: Listener<ButtonState>): this;

    on(event: "tapNotif", listener: Listener<TapData>): this;

    on(event: "quaternionNotif", listener: Listener<QuaternionData>): this;

    on(event: "stepCounterNotif", listener: Listener<StepData>): this;

    on(event: "rawNotif", listener: Listener<RawData>): this;

    on(event: "eulerNotif", listener: Listener<EulerData>): this;

    on(event: "rotationNotif", listener: Listener<RotationData>): this;

    on(event: "headingNotif", listener: (heading: number) => void): this;

    on(event: "gravityNotif", listener: Listener<GravityData>): this;

    gas_enable(callback: ErrorHandler): void;

    gas_disable(callback: ErrorHandler): void;

    gas_mode_set(gasMode: number, callback: ErrorHandler): void;

    temperature_enable(callback: ErrorHandler): void;

    temperature_disable(callback: ErrorHandler): void;

    temperature_interval_set(interval: number, callback: ErrorHandler): void;

    pressure_enable(callback: ErrorHandler): void;

    pressure_disable(callback: ErrorHandler): void;

    pressure_interval_set(interval: number, callback: ErrorHandler): void;

    humidity_enable(callback: ErrorHandler): void;

    humidity_disable(callback: ErrorHandler): void;

    humidity_interval_set(interval: number, callback: ErrorHandler): void;

    color_enable(callback: ErrorHandler): void;

    color_disable(callback: ErrorHandler): void;

    color_ref_led_set(led: { red: any, green: any, blue: any }, callback: ErrorHandler): void;

    // User interface

    led_off(callback: ErrorHandler): void;

    led_breathe(settings: { color: any, intensity: any, delay: any }, callback: ErrorHandler): void;

    led_set(rgb: { r: any, g: any, b: any }, callback: ErrorHandler): void;

    led_one_shot(settings: { color: any, intensity: any }, callback: ErrorHandler): void;

    button_enable(callback: ErrorHandler): void;

    button_disable(callback: ErrorHandler): void;

    // Motion
    stepCounter_interval_set(interval: any, callback: ErrorHandler): void;

    temp_compensation_interval_set(interval: any, callback: ErrorHandler): void;

    magnetometer_compensation_interval_set(interval: any, callback: ErrorHandler): void;

    motion_processing_freq_set(frequency: any, callback: ErrorHandler): void;

    wake_on_motion_set(state: any, callback: ErrorHandler): void;

    tap_enable(callback: ErrorHandler): void;

    tap_disable(callback: ErrorHandler): void;

    orientation_enable(callback: ErrorHandler): void;

    orientation_disable(callback: ErrorHandler): void;

    quaternion_enable(callback: ErrorHandler): void;

    quaternion_disable(callback: ErrorHandler): void;

    stepCounter_enable(callback: ErrorHandler): void;

    stepCounter_disable(callback: ErrorHandler): void;

    raw_enable(callback: ErrorHandler): void;

    raw_disable(callback: ErrorHandler): void;

    euler_enable(callback: ErrorHandler): void;

    euler_disable(callback: ErrorHandler): void;

    rotation_enable(callback: ErrorHandler): void;

    rotation_disable(callback: ErrorHandler): void;

    heading_enable(callback: ErrorHandler): void;

    heading_disable(callback: ErrorHandler): void;

    gravity_enable(callback: ErrorHandler): void;

    gravity_disable(callback: ErrorHandler): void;

    // Sound
    mic_enable(callback: ErrorHandler): void;

    mic_disable(callback: ErrorHandler): void;

    mic_mode_set(micMode: any, callback: ErrorHandler): void;

    speaker_status_enable(callback: ErrorHandler): void;

    speaker_status_disable(callback: ErrorHandler): void;

    speaker_mode_set(speaker_mode: number, callback: ErrorHandler): void;

    speaker_pcm_write(pcb: any, callback: ErrorHandler): void;
}
