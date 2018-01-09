import EventEmitter = NodeJS.EventEmitter;
import { Peripheral } from "noble";

export declare interface NobleDevice extends EventEmitter {
    id: string;
    uuid: string;
    address: string;
    addressType: string;

    _peripheral: Peripheral;

    connect(callback: (error: any) => void): void;

    disconnect(callback: (error: any) => void): void;

    connectAndSetUp(callback: (error: any) => void): void;

    // discoverServicesAndCharacteristics(callback: ErrorHandler): void;

    hasService(serviceUuid: string): boolean;

    hasCharacteristic(serviceUuid: string, characteristicUuid: string): void;

    // readDataCharacteristic(serviceUuid: string, characteristicUuid: string, callback: ErrorHandler): void;

    // writeDataCharacteristic(serviceUuid: string, characteristicUuid: string, data: any,  callback: ErrorHandler);

    on(event: string | symbol, listener: (...args: any[]) => void): this;

    on(event: "disconnected", listener: (...args: any[]) => void): this;
}
