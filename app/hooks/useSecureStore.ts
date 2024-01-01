import { StorageService } from "@app/core/secure-store/StorageService";
import { StorageServiceOptions } from "@app/core/secure-store/types";

export const useSecureStore = (opts?: Partial<StorageServiceOptions>) => {
    const storageFileUriKey: string = opts?.storageFileUriKey ?? 'atmfinder-ja';
    const persistStorage: string = opts?.persistStorage ?? 'atmfinderja-persist-storage/';
    return new StorageService({ persistStorage: persistStorage, storageFileUriKey: storageFileUriKey });
};
