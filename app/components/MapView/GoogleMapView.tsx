import MapView, { Marker, PROVIDER_GOOGLE, Camera, LatLng, Region } from 'react-native-maps';

import { forwardRef, PropsWithChildren } from 'react';
import { MapThemes } from './map-themes';
import { FontAwesome } from '@expo/vector-icons';
import { View } from '../themed/View';
import { atmData } from './map-view-data';
import { Image, useColorScheme } from 'react-native';
import Banks from '@app/constants/Banks';

export type MapViewType = {
    scrollEnabled?: boolean,
    defaultCamera?: Camera;
    containerStyle?: string;
    coordinates?: {
        latitude: number,
        longitude: number,
    },
    region?: Region,
    followLocation?: boolean
    userLocation?: LatLng;
    zoomEnabled?: boolean;
} & PropsWithChildren

export const GoogleMapView = forwardRef<MapView, MapViewType>(({ ...props }, ref) => {
    const DEFAULT_REGION = {
        //Jamaica
        latitude: 17.77027018441539,
        longitude: -77.18976974487305,
        latitudeDelta: 4.550155938686251,
        longitudeDelta: 2.274669148027897,
    }

    const colourScheme = useColorScheme() ?? 'light';
    const { defaultCamera, children, region, userLocation } = props;
    const { followLocation = false, zoomEnabled = true, scrollEnabled = true, } = props;

    const mapTheme = MapThemes[colourScheme];


    return (
        <View className='flex-1 flex'>
            <MapView
                ref={ref}
                scrollEnabled={scrollEnabled}
                followsUserLocation={followLocation}
                zoomControlEnabled={false}
                showsIndoors={false}
                showsCompass={false}
                showsPointsOfInterest={false}
                showsTraffic={false}
                showsBuildings={false}
                showsMyLocationButton={false}
                showsUserLocation={false}
                zoomEnabled={zoomEnabled}
                showsScale={true}
                camera={defaultCamera}
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                customMapStyle={mapTheme}
                region={region ?? DEFAULT_REGION}
                onUserLocationChange={(props) => {
                    // console.log(props.nativeEvent.coordinate, props.nativeEvent.error);
                }}
                onMapLoaded={() => {
                }}
                onRegionChange={({ latitude, longitude, latitudeDelta, longitudeDelta }, { isGesture }) => {
                    // console.log(latitudeDelta, longitudeDelta)
                    if (isGesture) {
                    } else {
                    }
                }}
            >
                {userLocation && (
                    <Marker
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        }}
                        title="You"
                        tracksViewChanges={false}
                    >
                        <View className='bg-red-500 border border-white flex h-6 w-6 rounded-full items-center justify-center'>
                            <FontAwesome name='location-arrow' color={"white"} size={15} />
                        </View>

                    </Marker>
                )}

                {
                    atmData.map((atm) => {
                        const bankLogo = Banks.find(item => item.code === atm.atmType)?.image;
                        return (
                            <Marker
                                tracksViewChanges={false}
                                tracksInfoWindowChanges={false}
                                key={atm.id}
                                coordinate={{
                                    latitude: atm.latitude,
                                    longitude: atm.longitude,
                                }}
                                title={atm.displayName}
                                description={atm.shortFormattedAddress}
                            >
                                {
                                    bankLogo ?
                                        (
                                            <Image
                                                source={bankLogo}
                                                style={{ width: 30, height: 30 }} resizeMode="contain"
                                            />
                                        ) :
                                        (
                                            <FontAwesome name='map-pin' color={"red"} size={25} />
                                        )
                                }
                            </Marker>
                        )
                    })
                }
                {children}
            </MapView>
        </View>
    )

})

