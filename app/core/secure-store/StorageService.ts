import { AES } from "./aes";
import * as FileSystem from 'expo-file-system';
import { StorageServiceOptions } from "./types";
import * as SecureStore from 'expo-secure-store';
import { randomUID } from "../randomUID";

export class StorageService {
    private storageFileUriKey: string;
    private persistStorage: string;
    private storageDirectoryUri: string;
    private encryptionService: AES;
    public constructor(opts: StorageServiceOptions) {
        this.persistStorage = opts.persistStorage;
        this.storageFileUriKey = opts.storageFileUriKey;
        this.storageDirectoryUri = `${FileSystem.documentDirectory}${opts.persistStorage}`;
        this.encryptionService = new AES();
    }

    public createDirectory = async () => {
        const { exists } = await FileSystem.getInfoAsync(this.storageDirectoryUri);
        if (!exists) {
            await FileSystem.makeDirectoryAsync(this.storageDirectoryUri, {
                intermediates: true,
            });
        }
    };

    public getAsync = async <TData extends Record<string, string>>(
        key: keyof TData,
        data?: string,
        secureStoreOptions: SecureStore.SecureStoreOptions | undefined = undefined
    ) => {
        let value = undefined;
        const aesKey = await SecureStore.getItemAsync(
            key.toString(),
            secureStoreOptions
        );
        if (aesKey) {
            const storageFileUri = await this.fixedStorageUri(secureStoreOptions);
            if (storageFileUri) {
                const storageString = await FileSystem.readAsStringAsync(
                    storageFileUri
                );
                const storage: TData = JSON.parse(storageString);
                const encryptedValue: string = storage[key];
                value = this.encryptionService.decrypt(encryptedValue, aesKey);
            }
        } else if (data) {
            console.log(key, data);
            await this.setAsync(key as string, data, secureStoreOptions);
            return data;
        }
        return value;

    };

    public setAsync = async (
        key: string,
        value: string,
        secureStoreOptions: SecureStore.SecureStoreOptions | undefined = undefined
    ) => {

        let storage = {};
        const currentStorageFileUri = await this.fixedStorageUri(
            secureStoreOptions
        );
        if (currentStorageFileUri) {
            const storageString = await FileSystem.readAsStringAsync(
                currentStorageFileUri
            );
            storage = JSON.parse(storageString);
        }
        const { encryptionKey, encryptedData } =
            this.encryptionService.encryptWithRandomKey(value);
        storage = { ...storage, [key]: encryptedData };
        const storageString = JSON.stringify(storage);
        const newStorageFileUri = await this.generateStorageFileUri();
        await FileSystem.writeAsStringAsync(newStorageFileUri, storageString);
        await SecureStore.setItemAsync(
            this.storageFileUriKey,
            newStorageFileUri,
            secureStoreOptions
        );
        await SecureStore.setItemAsync(key, encryptionKey, secureStoreOptions);
        if (currentStorageFileUri) {
            await FileSystem.deleteAsync(currentStorageFileUri, {
                idempotent: true,
            });
        }

    };

    public clearAsync = async (
        secureStoreOptions: SecureStore.SecureStoreOptions | undefined = undefined
    ) => {
        const currentStorageFileUri = await this.fixedStorageUri(
            secureStoreOptions
        );
        if (currentStorageFileUri) {
            await FileSystem.deleteAsync(currentStorageFileUri, {
                idempotent: true,
            });
        }
        await SecureStore.deleteItemAsync(
            this.storageFileUriKey,
            secureStoreOptions
        );
    };

    public removeAsync = async (
        key: string,
        secureStoreOptions: SecureStore.SecureStoreOptions | undefined = undefined
    ) => {
        const currentStorageFileUri = await this.fixedStorageUri(
            secureStoreOptions
        );
        if (currentStorageFileUri) {
            let storageString = await FileSystem.readAsStringAsync(
                currentStorageFileUri
            );
            const storage = JSON.parse(storageString);
            delete storage.key;
            storageString = JSON.stringify(storage);
            const newStorageFileUri = await this.generateStorageFileUri();
            await FileSystem.writeAsStringAsync(newStorageFileUri, storageString);
            await SecureStore.setItemAsync(
                this.storageFileUriKey,
                newStorageFileUri,
                secureStoreOptions
            );
            await FileSystem.deleteAsync(currentStorageFileUri, {
                idempotent: true,
            });
        }
        await SecureStore.deleteItemAsync(key, secureStoreOptions);

    };

    private generateStorageFileUri = async (
        fileName: string | undefined = undefined
    ) => {
        if (!fileName) {
            fileName = randomUID(32);
        }
        const uri = `${this.storageDirectoryUri}${fileName}`;
        return uri;
    };

    private fixedStorageUri = async (
        secureStoreOptions: SecureStore.SecureStoreOptions | undefined = undefined
    ) => {
        const currentStorageFileUri = await SecureStore.getItemAsync(
            this.storageFileUriKey,
            secureStoreOptions
        );
        if (currentStorageFileUri) {
            const components = currentStorageFileUri.split(this.persistStorage);
            if (components.length === 2) {
                const fileName = components[1];
                const uri = `${this.storageDirectoryUri}${fileName}`;
                const { exists } = await FileSystem.getInfoAsync(uri);
                if (exists) {
                    return uri;
                }
            }
        }

        return null;
    };
}
