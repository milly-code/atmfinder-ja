import { getCurrentPositionAsync, LocationAccuracy, LocationObject } from "expo-location";


export const getUserCurrentLocation = async (retries: number = 3, timeoutMilliseconds: number = 5000): Promise<LocationObject> => {
    // This is a hack because sometimes the getCurrentPositionAsync hangs
    // thus not updating user location
    // Check this out https://github.com/expo/expo/issues/15478
    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout exceeded')), timeoutMilliseconds)
    );

    try {
        return await Promise.race([getCurrentPositionAsync({ accuracy: LocationAccuracy.Highest }), timeout]) as LocationObject;
    } catch (error) {
        if (retries > 0) {
            return getUserCurrentLocation(retries - 1, timeoutMilliseconds);
        } else {
            throw error;
        }
    }
}