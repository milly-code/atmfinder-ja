import { ButtonPrimary } from "@app/components/themed/Buttons";
import { HeadingText, SubHeading, CaptionText } from "@app/components/themed/Text"
import { View } from "@app/components/themed/View";
import Colors from "@app/constants/Colors";
import strings from "@app/constants/strings";
import { useSecureStore } from "@app/hooks/useSecureStore";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Constants from "expo-constants"
import { FC } from "react";
import { useColorScheme } from "react-native";

type Props = NativeStackScreenProps<{ map: undefined, welcome: undefined }, 'welcome'>;

export const WelcomeScreen: FC<Props> = ({ navigation: { replace } }) => {
    const colourScheme = useColorScheme() ?? 'light';
    const { setAsync } = useSecureStore();
    const goToMapView = async () => {
        await setAsync(strings.storageKey.APP_FIRST_LAUNCH, 'true');
        replace('map');
    }
    return (
        <View className="flex-1 justify-between py-4 items-center">
            <View className="w-full flex-col flex-1 items-center justify-center space-y-24">
                <View className="flex-col items-center justify-center space-y-9">
                    <HeadingText>ATMFinder JA </HeadingText>
                    <View className="flex-col justify-center items-center space-y-4">
                        <View className="flex-row items-center w-10/12 space-x-3" >
                            <Ionicons name="pin" color={Colors[colourScheme].danger} size={30}></Ionicons>
                            <View className="flex-col ">
                                <SubHeading componentClass="mb-1">Find Nearby Working ATMs</SubHeading>
                                <CaptionText componentClass="text-gray-400 dark: text-gray-500">
                                    Our map shows the ATMs near you with Online and Offline status. ATMs are colour-coded according to Banks to improve your user experience.
                                </CaptionText>
                            </View>
                        </View>
                        <View className="flex-row items-center w-10/12 space-x-3" >
                            <FontAwesome name="star" color={Colors[colourScheme].warning} size={30}></FontAwesome>
                            <View className="flex-col ">
                                <SubHeading componentClass="mb-1">Community-Driven Updates</SubHeading>
                                <CaptionText componentClass="text-gray-400 dark: text-gray-500">
                                    Benefit from the collective knowledge of users who update ATM status. Submitting current status of ATMs you visit helps to keep the community informed. Thank you for contributing!
                                </CaptionText>
                            </View>
                        </View>
                        <View className="flex-row items-center w-10/12 space-x-3" >
                            <FontAwesome name="location-arrow" color={Colors[colourScheme].info} size={30}></FontAwesome>
                            <View className="flex-col">
                                <SubHeading componentClass="mb-1">Get Navigation to ATM</SubHeading>
                                <CaptionText componentClass="text-gray-400 dark: text-gray-500">
                                    Whether you're a local or a tourist, our user-friendlt app ensures you have the means to find nearby working cash withdrawl points.
                                </CaptionText>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="w-10/12">
                    <ButtonPrimary onPress={goToMapView}>Continue</ButtonPrimary>
                </View>
            </View>
            <CaptionText componentClass="text-gray-400 dark: text-gray-500">Version: {Constants.expoConfig?.version}</CaptionText>
        </View>
    )
}