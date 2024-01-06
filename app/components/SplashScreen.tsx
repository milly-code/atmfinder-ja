import { ActivityIndicator, Image } from "react-native";
import { CaptionText, HeadingText } from "./themed/Text";
import { View } from "./themed/View";
import { useColorScheme } from "@app/hooks/useColorScheme";
import Constants from "expo-constants";
import { StatusBar } from "./themed/StatusBar";

export const SplashScreen = () => {
    const { themeColours } = useColorScheme();
    return (
        <View className="flex-1 h-screen w-screen items-center justify-between py-5">
            <StatusBar />
            <View className='flex-col items-center justify-center space-y-4 w-full flex-1'>
                <Image
                    source={require('../../assets/logo.png')}
                    className="rounded-lg h-14 w-14"
                    resizeMode="cover"
                />
                <View><HeadingText>ATMFinder JA </HeadingText></View>
                <ActivityIndicator color={themeColours.tint} size={30} />
            </View>
            <View className="flex-col">
                <View><CaptionText>Version: {Constants.expoConfig?.version}</CaptionText></View>
            </View>
        </View>
    )
}