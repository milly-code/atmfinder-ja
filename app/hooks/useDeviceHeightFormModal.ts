import { StatusBar, Platform, Dimensions } from 'react-native';
export const useDeviceHeightFormModal = () => {
    const isAndroid = Platform.OS === 'android';

    if (isAndroid) {
        return ((StatusBar.currentHeight ?? 0) + Dimensions.get('screen').height)
    }
    return undefined;
}