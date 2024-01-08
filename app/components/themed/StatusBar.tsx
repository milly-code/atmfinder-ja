import { useColorScheme } from "@app/hooks/useColorScheme";
import { FC } from "react";
import { StatusBar as DefaultStatusBar } from "react-native";
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
export const StatusBar: FC = () => {
    const { colourScheme, themeColours } = useColorScheme();
    return (
        // <DefaultStatusBar backgroundColor={themeColours.background} barStyle={colourScheme == 'dark' ? 'light-content' : 'dark-content'} />
        // <ExpoStatusBar style={'auto'} translucent backgroundColor="red"  />
        <ExpoStatusBar translucent  style={colourScheme == 'dark' ? 'light' : 'dark'} />
    )
}