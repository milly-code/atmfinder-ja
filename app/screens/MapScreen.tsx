import { useEffect, useRef, useState } from "react";
import { AlertModal } from "@app/components/Modals/AlertModal";
import { GoogleMapView } from "@app/components/MapView/GoogleMapView";
import GoogleMap, { Region } from "react-native-maps";
import { getForegroundPermissionsAsync, requestForegroundPermissionsAsync, getCurrentPositionAsync, PermissionStatus } from "expo-location";
import { Image, Pressable, StatusBar, useColorScheme } from "react-native";
import { Text } from "@app/components/themed/Text";
import { View } from "@app/components/themed/View";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@app/constants/Colors";
import { PopupModal } from "@app/components/Modals/PopupModal";
import { twJoin } from "tailwind-merge";
import Banks from "@app/constants/Banks";

export const MapScreen = () => {
    const _mapViewRef = useRef<GoogleMap>(null);
    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>();
    const [currentMenu, setCurrentMenu] = useState<'help' | 'keys' | 'none'>('none');
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

    return (
        <View className="flex-1">
            <AlertModal
                show={permissionStatus === PermissionStatus.UNDETERMINED}
                title='Discover Nearby ATMs'
                primaryAction={{ onPress: getLocation, title: 'enable' }}
                message="To provide you with the best service, we'd like to find ATMs near you. Your location will be used only for this purpose and will not be stored or shared. Please enable location services to continue."
            />
            <PopupModal show={currentMenu === 'keys'} title="ATM Keys" closeModal={() => { setCurrentMenu('none') }}>
                <View className="flex-col justify-center space-y-3 my-5 w-full px-4">
                    {
                        Banks.map(({ bank, image }, index) => {
                            return (
                                <View key={index} className={
                                    twJoin(
                                        "flex-row justify-between px-2 pb-4 pt-2 items-center",
                                        index + 1 === Banks.length ? '' : 'border-b border-gray-500'
                                    )
                                }>
                                    <Text style={{ fontSize: 18 }}>{bank}</Text>
                                    <Image
                                        source={image}
                                        style={{ width: 25, height: 25 }} resizeMode="contain"
                                    />
                                </View>
                            )
                        })
                    }
                </View>
            </PopupModal>
            <GoogleMapView ref={_mapViewRef} region={currentLocation} userLocation={currentLocation} />
            <View className='absolute top-0 w-full p-2 bg-transparent items-end right-5' style={{ marginTop: (StatusBar.currentHeight ?? 0) + 10 }}>
                <View className='flex flex-row bg-transparent space-x-4'>
                    {
                        currentLocation && (
                            <Pressable onPress={() => {
                                _mapViewRef.current?.animateToRegion(currentLocation);
                            }}>
                                <FontAwesome name="location-arrow" size={25} color={Colors[colourScheme].success} />
                            </Pressable>
                        )
                    }
                    <FontAwesome name="refresh" size={25} color={Colors[colourScheme].success} />

                    <Pressable
                        onPress={() => {
                            setCurrentMenu('keys');
                        }}
                    >
                        <FontAwesome name="key" size={25} color={Colors[colourScheme].success} />
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setCurrentMenu('help');
                        }}
                    >
                        <FontAwesome name="ellipsis-v" size={25} color={Colors[colourScheme].success} />
                    </Pressable>

                </View>
            </View>
        </View>
    )
}