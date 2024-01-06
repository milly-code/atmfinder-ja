import { forwardRef } from "react";
import { View } from "./themed/View";
import { Text } from "./themed/Text";
import Constants from "expo-constants";
import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { BottomSheet } from "./themed/BottomSheet";
import GorhomBottomSheet from "@gorhom/bottom-sheet";
import { useColorScheme } from "@app/hooks/useColorScheme";

export const ActionMenu = forwardRef<GorhomBottomSheet>((_, bottomSheetRef) => {
    const { themeColours } = useColorScheme();
    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={['30%']}
            enablePanDownToClose
        >
            <View className="flex-col justify-center w-full px-4 divide-y divide-gray-200/80 dark:divide-gray-500">
                <Pressable>
                    <View className="flex-row space-x-3 px-2 py-3.5 items-center">
                        <FontAwesome name="star" size={20} color={themeColours.tint} />
                        <Text style={{ fontSize: 18 }}>Love the app? Leave a rating</Text>
                    </View>
                </Pressable>
                <Pressable>
                    <View className="flex-row space-x-3 px-2 py-3.5 items-center">
                        <FontAwesome name="comment" size={20} color={themeColours.tint} />
                        <Text style={{ fontSize: 18 }}>Contact Support</Text>
                    </View>
                </Pressable>
                <Pressable>
                    <View className="flex-row space-x-3 px-2 py-3.5 items-center ">
                        <FontAwesome name="info-circle" size={20} color={themeColours.tint} />
                        <Text style={{ fontSize: 18 }}>Version: {Constants.expoConfig?.version}</Text>
                    </View>
                </Pressable>
            </View>
        </BottomSheet>
    )
})