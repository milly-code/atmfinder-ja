import { LatLng } from "react-native-maps";
import { getUserCurrentLocation } from "./getUserCurrentLocation";
import { PermissionStatus, getForegroundPermissionsAsync } from "expo-location";

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
type WithinRangeType = 'within-range' | 'not-in-range' | 'location-disabled' | 'error';
export const checkIfAtmIsWithinRange = async (atmPosition: LatLng, distanceInKm: number = 1): Promise<WithinRangeType> => {
    const earthRadius = 6371;

    try {
        const { status } = await getForegroundPermissionsAsync();
        if (status !== PermissionStatus.GRANTED) {
            return 'location-disabled';
        }
        const { coords: currentLocation } = await getUserCurrentLocation();
        const delta: LatLng = {
            latitude: toRadians(atmPosition.latitude - currentLocation.latitude),
            longitude: toRadians(atmPosition.longitude - currentLocation.longitude),
        }

        const a =
            Math.sin(delta.latitude / 2) * Math.sin(delta.latitude / 2) +
            Math.cos(toRadians(currentLocation.latitude)) *
            Math.cos(toRadians(atmPosition.latitude)) *
            Math.sin(delta.longitude / 2) *
            Math.sin(delta.longitude / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = earthRadius * c;
        if (distance <= distanceInKm) {
            return 'within-range';
        }
        return 'not-in-range';
    } catch (_) {
        // cannot get user's location details;
        return 'error';
    }

}

export class RangeStatusError extends Error {
    rangeType: WithinRangeType;
    cause?: unknown;
    message: string;
    constructor(rangeType: WithinRangeType, message: string, cause?: unknown) {
        super(message);
        this.message = message;
        this.cause = cause;
        this.rangeType = rangeType;
    }
}