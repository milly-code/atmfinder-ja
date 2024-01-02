import { useEffect, useRef, useState } from "react";
import { AlertModal } from "@app/components/Modals/AlertModal";
import { GoogleMapView } from "@app/components/MapView/GoogleMapView";
import GoogleMap, { Region } from "react-native-maps";
import { getForegroundPermissionsAsync, requestForegroundPermissionsAsync, getCurrentPositionAsync, PermissionStatus } from "expo-location";
import { Pressable, StatusBar, useColorScheme } from "react-native";
import { View } from "@app/components/themed/View";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Colors from "@app/constants/Colors";
import { ATMKeyView } from "@app/components/ATMKeyView";
import BottomSheet from '@gorhom/bottom-sheet';
import { ActionMenu } from "@app/components/ActionMenu";

export const MapScreen = () => {

    const _atmKeyBottomSheetRef = useRef<BottomSheet>(null);
    const _actionMenuBottomSheetRef = useRef<BottomSheet>(null);

    const _mapViewRef = useRef<GoogleMap>(null);
    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>();

    const [currentLocation, setCurrentLocation] = useState<Region>();

    const getLocation = async () => {
        const { status } = await requestForegroundPermissionsAsync();
        setPermissionStatus(status);
        if (status !== "granted") {
            return;
        }
        const { coords } = await getCurrentPositionAsync();

        setCurrentLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.052,
            longitudeDelta: 0.026
        });
    };

    useEffect(() => {
        let mounted = true;

        const checkIfUserHasLocationPermissionTurnedOn = async () => {
            if (!mounted) {
                return;
            }
            const { status } = await getForegroundPermissionsAsync();
            if (status === PermissionStatus.GRANTED) {
                const { coords } = await getCurrentPositionAsync();
                setCurrentLocation({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.052,
                    longitudeDelta: 0.026
                });
            }
            setPermissionStatus(status);
        }

        checkIfUserHasLocationPermissionTurnedOn();
        mounted = false;
    }, []);

    useEffect(() => {
        if (currentLocation) {
            _mapViewRef.current?.animateToRegion(currentLocation);
        }
    }, [currentLocation]);

    const colourScheme = useColorScheme() ?? 'light';

    const [filteredAtmType, setFilteredAtmType] = useState<ATMType>()

    const filterAtmByCode = (code?: ATMType) => {
        _atmKeyBottomSheetRef.current?.close();
        setFilteredAtmType(code);
    }

    return (
        <View className="flex-1">
            <AlertModal
                show={permissionStatus === PermissionStatus.UNDETERMINED}
                title='Discover Nearby ATMs'
                primaryAction={{ onPress: getLocation, title: 'enable' }}
                message="To provide you with the best service, we'd like to find ATMs near you. Your location will be used only for this purpose and will not be stored or shared. Please enable location services to continue."
            />

            <GoogleMapView atmTypeFilter={filteredAtmType} ref={_mapViewRef} region={currentLocation} userLocation={currentLocation} />

            <ATMKeyView ref={_atmKeyBottomSheetRef} filterAtmByCode={filterAtmByCode} />
            <ActionMenu ref={_actionMenuBottomSheetRef} />
            <View className='absolute top-0 w-full p-2 bg-transparent items-end right-5' style={{ marginTop: (StatusBar.currentHeight ?? 0) + 10 }}>
                <View className='flex flex-row bg-transparent space-x-4'>
                    {
                        currentLocation && (
                            <Pressable onPress={async () => {
                                _actionMenuBottomSheetRef.current?.close();
                                _atmKeyBottomSheetRef.current?.close();
                                _mapViewRef.current?.animateToRegion(currentLocation);
                            }}>
                                <FontAwesome name="location-arrow" size={25} color={Colors[colourScheme].success} />
                            </Pressable>
                        )
                    }
                    <Ionicons name="refresh" size={25} color={Colors[colourScheme].success} />

                    <Pressable onPress={() => _atmKeyBottomSheetRef.current?.expand()}>
                        <Ionicons name="key" size={25} color={Colors[colourScheme].success} />
                    </Pressable>
                    <Pressable onPress={() => _actionMenuBottomSheetRef.current?.expand()}>
                        <Ionicons name="ellipsis-vertical" size={25} color={Colors[colourScheme].success} />
                    </Pressable>

                    {
                        filteredAtmType && (
                            <Pressable onPress={() => setFilteredAtmType(undefined)}>
                                <Ionicons name="close" size={25} color={Colors[colourScheme].success} />
                            </Pressable>
                        )
                    }
                </View>
            </View>
        </View >
    )
}