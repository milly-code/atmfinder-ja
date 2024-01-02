import BottomSheet from "@gorhom/bottom-sheet"
import { forwardRef } from "react"
import { View } from "./themed/View"
import { Text } from "./themed/Text"
import { Pressable, useColorScheme } from "react-native"
import Colors from "@app/constants/Colors"
import { FontAwesome } from "@expo/vector-icons"
import Constants from "expo-constants"

export const ActionMenu = forwardRef<BottomSheet>((_, bottomSheetRef) => {
    const colourScheme = useColorScheme() ?? 'light';
    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={['30%']}
            style={{}}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: Colors[colourScheme].background }}
            handleComponent={() => <View className='flex flex-col items-center mt-2'><View className='h-1 rounded-sm w-7 bg-gray-900 dark:bg-gray-500 mb-3'></View></View>}
        >
            <View className="px-4">
                <Pressable>
                    <View className="flex-row space-x-3 px-2 pb-4 pt-3 items-center border-b border-gray-500">
                        <Text style={{ fontSize: 18 }}>Love the app? Leave a rating</Text>
                        <FontAwesome name="star" size={20} color={Colors[colourScheme].tint} />
                    </View>
                </Pressable>
                <Pressable>
                    <View className="flex-row space-x-3 px-2 pb-4 pt-3 items-center border-b border-gray-500">
                        <Text style={{ fontSize: 18 }}>Contact Support</Text>
                        <FontAwesome name="comment" size={20} color={Colors[colourScheme].tint} />
                    </View>
                </Pressable>
                <Pressable>
                    <View className="flex-row space-x-3 px-2 pb-4 pt-3 items-center ">
                        <Text style={{ fontSize: 18 }}>Version: {Constants.expoConfig?.version}</Text>
                        <FontAwesome name="info-circle" size={20} color={Colors[colourScheme].tint} />
                    </View>
                </Pressable>
            </View>
        </BottomSheet>
    )
})