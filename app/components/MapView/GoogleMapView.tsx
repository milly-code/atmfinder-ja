import { Image } from 'react-native';
import { View } from '../themed/View';
import Banks from '@app/constants/Banks';
import { MapThemes } from './map-themes';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@app/hooks/useColorScheme';
import { useAppStoreState } from '@app/hooks/useAppStoreState';
import { forwardRef, PropsWithChildren, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';



const DEFAULT_REGION = {
    //Jamaica
    latitude: 17.77027018441539,
    longitude: -77.18976974487305,
    latitudeDelta: 4.550155938686251,
    longitudeDelta: 2.274669148027897,
}
type MapViewProps = PropsWithChildren & { onMapLoaded?: () => void }
export const GoogleMapView = forwardRef<MapView, MapViewProps>(({ ...props }, ref) => {
    const { children, onMapLoaded } = props;
    const { colourScheme } = useColorScheme();
    const { clearViewingAtm, atms, viewAtm, fetchAtmData, filteredAtmType } = useAppStoreState();


    useEffect(() => {
        fetchAtmData();
    }, []);

    const filtered = filteredAtmType ? atms.filter((atm) => atm.atmType === filteredAtmType) : atms;


    return (
        <View className='flex-1 flex'>
            <MapView
                ref={ref}
                showsCompass={false}
                scrollEnabled={true}
                followsUserLocation={true}
                zoomControlEnabled={false}
                showsMyLocationButton={false}
                showsUserLocation={true}
                zoomEnabled={true}
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                customMapStyle={MapThemes[colourScheme]}
                region={DEFAULT_REGION}
                onPress={clearViewingAtm}
                onMapReady={onMapLoaded}

            >

                {
                    filtered.map((atm, index) => {
                        const bankLogo = Banks.find(item => item.code === atm.atmType)?.image;
                        // TODO: if atm data is corrupt then I need to catch those.
                        return (
                            <Marker
                                tracksViewChanges={false}
                                tracksInfoWindowChanges={false}
                                key={`${atm.id}_${index}`}
                                coordinate={{
                                    latitude: atm.latitude,
                                    longitude: atm.longitude,
                                }}
                                onPress={() => viewAtm(atm)}
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

