export declare interface NobleDevice {
    id: string;
    uuid: string;
    address: string;
    addressType: string;

    connect(callback: (error: any) => void): void;

    disconnect(callback: (error: any) => void): void;

    connectAndSetUp(callback: (error: any) => void): void;

    // discoverServicesAndCharacteristics(callback: ErrorHandler): void;

    hasService(serviceUuid: string): boolean;

    hasCharacteristic(serviceUuid: string, characteristicUuid: string): void;

    // readDataCharacteristic(serviceUuid: string, characteristicUuid: string, callback: ErrorHandler): void;

    // writeDataCharacteristic(serviceUuid: string, characteristicUuid: string, data: any,  callback: ErrorHandler);

    on(event: "disconnected", listener: () => void): void;
}
