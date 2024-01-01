import MapView, { Marker, PROVIDER_GOOGLE, Camera, LatLng, Region } from 'react-native-maps';

import { forwardRef, PropsWithChildren } from 'react';
import { MapThemes } from './map-themes';
import { FontAwesome } from '@expo/vector-icons';
import { View } from '../themed/View';
import { atmData } from './map-view-data';
import { useColorScheme } from 'react-native';

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
    const colourScheme = useColorScheme() ?? 'light';
    const { defaultCamera, children, region, userLocation = {
        latitude: 17.77027018441539,
        longitude: -77.18976974487305,
    } } = props;
    const { followLocation = false, zoomEnabled = true, scrollEnabled = true, } = props;

    const mapTheme = MapThemes[colourScheme];

    return (
        <View className='flex-1 flex'>
            <MapView
                ref={ref}
                scrollEnabled={scrollEnabled}
                followsUserLocation={followLocation}
                zoomControlEnabled={false}
                showsIndoors={true}
                showsCompass={true}
                showsPointsOfInterest={false}
                showsTraffic={false}
                showsBuildings={false}
                showsMyLocationButton={true}
                showsUserLocation={true}
                zoomEnabled={zoomEnabled}
                showsScale={true}
                camera={defaultCamera}
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                customMapStyle={mapTheme}
                region={region ?? {
                    latitude: 17.77027018441539,
                    longitude: -77.18976974487305,
                    latitudeDelta: 0.160,
                    longitudeDelta: 0.121,
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
                        <View className='flex-col items-center justify-center rounded-full bg-gray-100 px-1 py-0.5'>
                            <FontAwesome name='circle' color={"red"} size={25} />
                        </View>

                    </Marker>
                )}

                {
                    atmData.map((atm) => {
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
                                <FontAwesome name='map-pin' color={"red"} size={25} />
                            </Marker>
                        )
                    })
                }
                {children}
            </MapView>
        </View>
    )

})

