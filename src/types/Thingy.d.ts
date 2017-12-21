// export type EventName =
//     "pressureNotif"
//     | "humidityNotif"
//     | "gasNotif"
//     | "colorNotif"
//     | "buttonNotif"
//     | "tapNotif"
//     | "headingNotif"
//     | "gravityNotif"
//     | "speakerStatusNotif"
//     | "MicrophoneNotif"
//     | OrientationEvent
//     | QuaternionEvent
//     | StepEvent
//     | RawEvent
//     | EulerEvent
//     | RotationEvent;


import { NobleDevice } from "./NobleDevice";

export type ButtonState = "Pressed" | "Released";

export type StepEvent = "stepCounterNotif";
export type QuaternionEvent = "quaternionNotif";
export type EulerEvent = "eulerNotif";
export type RawEvent = "rawNotif";
export type OrientationEvent = "orientationNotif";
export type RotationEvent = "rotationNotif";
export type DisconnectedEvent = "disconnect";

export type ErrorHandler = (error: any) => void;
export type Listener<T> = (data: T) => void;

export type QuaternionData = { w: number, x: number, y: number, z: number };
export type EulerData = { roll: number, pitch: number, yaw: number };
export type Coordinate = { x: number, y: number, z: number };
export type RawData = { accelerometer: Coordinate, gyroscope: Coordinate, compass: Coordinate };
export type OrientationData = number;

export declare function on(event: "rawNotif", listener: Listener<RawData>): void;
export declare function on(event: "orientationNotif", listener: Listener<RawData>): void;
export declare function on(event: "eulerNotif", listener: Listener<EulerData>): void;
export declare function on(event: "quaternionNotif", listener: Listener<QuaternionData>): void;

export interface Thingy extends NobleDevice {

    on(event: "rawNotif", listener: Listener<RawData>): void;

    on(event: "orientationNotif", listener: Listener<OrientationData>): void;

    on(event: "eulerNotif", listener: Listener<EulerData>): void;

    on(event: "quaternionNotif", listener: Listener<QuaternionData>): void;

    on(event: string, listener: Function): void;

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

    // Sound
    mic_enable(callback: ErrorHandler): void;

    mic_disable(callback: ErrorHandler): void;

    mic_mode_set(micMode: any, callback: ErrorHandler): void;

    speaker_status_enable(callback: ErrorHandler): void;

    speaker_status_disable(callback: ErrorHandler): void;

    speaker_mode_set(speaker_mode: number, callback: ErrorHandler): void;

    speaker_pcm_write(pcb: any, callback: ErrorHandler): void;
}
