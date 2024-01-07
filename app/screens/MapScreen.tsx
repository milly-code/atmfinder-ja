import { ATMType } from "@types";
import { useEffect, useRef, useState } from "react";
import { View } from "@app/components/themed/View";
import { Pressable, StatusBar } from "react-native";
import GorhomBottomSheet from '@gorhom/bottom-sheet';
import { getUserCurrentLocation } from "@app/helpers";
import GoogleMap, { Region } from "react-native-maps";
import { ATMKeyView } from "@app/components/ATMKeyView";
import { ActionMenu } from "@app/components/ActionMenu";
import { useColorScheme } from "@app/hooks/useColorScheme";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useAppStoreState } from "@app/hooks/useAppStoreState";
import { AlertModal } from "@app/components/Modals/AlertModal";
import { ATMDetailsView } from "@app/components/ATMDetailsView";
import { GoogleMapView } from "@app/components/MapView/GoogleMapView";
import { getForegroundPermissionsAsync, requestForegroundPermissionsAsync, getCurrentPositionAsync, PermissionStatus, LocationAccuracy, LocationObject, } from "expo-location";


const LATITUDE_DELTA = 0.052;
const LONGITUDE_DELTA = 0.026;
export const MapScreen = () => {
    const _atmKeyBottomSheetRef = useRef<GorhomBottomSheet>(null);
    const _actionMenuBottomSheetRef = useRef<GorhomBottomSheet>(null);
    const _atmDetailsBottomSheetRef = useRef<GorhomBottomSheet>(null);
    const _mapViewRef = useRef<GoogleMap>(null);

    const { themeColours } = useColorScheme();
    const { clearViewingAtm, viewingAtm, filteredAtmType, clearAtmFilterType, setAtmTypeFilter, fetchAtmData } = useAppStoreState();

    const filterAtmsByCode = (code: ATMType) => {
        setAtmTypeFilter(code);
        _atmKeyBottomSheetRef.current?.close();
    }

    const expandBottomSheet = (type: 'action-menu' | 'atm-keys') => {
        clearViewingAtm();
        _atmDetailsBottomSheetRef.current?.close();
        if (type === 'action-menu') {
            _atmKeyBottomSheetRef.current?.close();
            _actionMenuBottomSheetRef.current?.expand();
        } else if (type === 'atm-keys') {
            _actionMenuBottomSheetRef.current?.close();
            _atmKeyBottomSheetRef.current?.expand();
        }
    }

    useEffect(() => {
        if (viewingAtm) {
            _atmDetailsBottomSheetRef.current?.snapToIndex(0);
            _atmKeyBottomSheetRef.current?.close();
            _actionMenuBottomSheetRef.current?.close();
        }
        else {
            _atmDetailsBottomSheetRef.current?.close();
        }
    }, [viewingAtm])

    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>();
    const [currentLocation, setCurrentLocation] = useState<Region>();

    const requestUserLocationPermission = async () => {
        let { status } = await requestForegroundPermissionsAsync();
        setPermissionStatus(status);
        if (status !== "granted") {
            return;
        }
        await animateToUserLocation();
    };

    const animateToUserLocation = async () => {

        try {
            const { coords } = await getUserCurrentLocation();

            setCurrentLocation({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            });
        } catch (e) {
            // unable to get user's location :(
            //TODO: find a package to replace expo location. 
            // Maybe use the onLocationChanged from the mapview to update the location.

        }
    }

    useEffect(() => {
        // On first lauch the location permission should be undetermined;
        // if this is the case then we want to show the message for requesting permission
        let mounted = true;
        const checkIfUserHasLocationPermissionTurnedOn = async () => {
            if (!mounted) {
                return;
            }
            const { status } = await getForegroundPermissionsAsync();
            setPermissionStatus(status);
            if (status === PermissionStatus.GRANTED) {
                await animateToUserLocation();
            }
        }
        checkIfUserHasLocationPermissionTurnedOn();
        mounted = false;
    }, [])

    useEffect(() => {
        if (currentLocation) {
            _mapViewRef.current?.animateToRegion(currentLocation);
        }
    }, [currentLocation]);


    return (
        <View className="flex-1">
            <AlertModal
                show={permissionStatus === PermissionStatus.UNDETERMINED}
                title='Discover Nearby ATMs'
                primaryAction={{ onPress: requestUserLocationPermission, title: 'enable' }}
                message="To provide you with the best service, we'd like to find ATMs near you. Your location will be used only for this purpose and will not be stored or shared. Please enable location services to continue."
            />

            <GoogleMapView ref={_mapViewRef} />

            <ATMKeyView ref={_atmKeyBottomSheetRef} onBankPressed={filterAtmsByCode} />
            <ActionMenu ref={_actionMenuBottomSheetRef} />
            <ATMDetailsView ref={_atmDetailsBottomSheetRef} />
            <View className='absolute -top-10 w-full p-2 bg-transparent items-end px-4 ' style={{ marginTop: (StatusBar.currentHeight ?? 0) + 10 }}>
                <View className='flex flex-row bg-transparent space-x-4'>
                    {
                        currentLocation && (
                            <Pressable onPress={async () => {
                                _actionMenuBottomSheetRef.current?.close();
                                _atmKeyBottomSheetRef.current?.close();
                                _mapViewRef.current?.animateToRegion(currentLocation);
                            }}>
                                <FontAwesome name="location-arrow" size={25} color={themeColours.success} />
                            </Pressable>
                        )
                    }
                    <Ionicons onPress={() => fetchAtmData()} name="refresh" size={25} color={themeColours.success} />

                    <Pressable onPress={() => expandBottomSheet('atm-keys')}>
                        <Ionicons name="key" size={25} color={themeColours.success} />
                    </Pressable>
                    <Pressable onPress={() => expandBottomSheet('action-menu')}>
                        <Ionicons name="ellipsis-vertical" size={25} color={themeColours.success} />
                    </Pressable>

                    {
                        filteredAtmType && (
                            <Pressable onPress={clearAtmFilterType}>
                                <Ionicons name="close" size={25} color={themeColours.success} />
                            </Pressable>
                        )
                    }
                </View>
            </View>
        </View>
    )
}