import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { SubHeading, Text } from './themed/Text';
import { View } from './themed/View';
import Colors from '@app/constants/Colors';
import { Image, Pressable, useColorScheme } from 'react-native';
import Banks from '@app/constants/Banks';
import { twJoin } from 'tailwind-merge';


type ATMKeyViewProps = {
    filterAtmByCode?: (code: ATMType) => void;
}

export const ATMKeyView = forwardRef<BottomSheet, ATMKeyViewProps>(({ filterAtmByCode }, bottomSheetRef) => {
    const colourScheme = useColorScheme() ?? 'light';
    const dismiss = (code: ATMType) => {
        if (filterAtmByCode) {
            filterAtmByCode(code);
        }
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={['70%']}
            style={{}}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: Colors[colourScheme].background }}
            handleComponent={() => <View className='flex flex-col items-center mt-2'><View className='h-1 rounded-sm w-7 bg-gray-900 dark:bg-gray-500 mb-3'></View></View>}
        >
            <View className='flex-col items-center'>
                <SubHeading>ATM Keys</SubHeading>
            </View>
            <BottomSheetScrollView>
                <View className="flex-col justify-center space-y-3 my-5 w-full px-4">
                    {
                        Banks.map(({ bank, image, code }, index) => {
                            return (
                                <Pressable key={index} onPress={() => dismiss(code)}>
                                    <View className={
                                        twJoin(
                                            "flex-row justify-between px-2 pb-4 pt-2 items-center",
                                            index + 1 === Banks.length ? '' : 'border-b border-gray-500'
                                        )
                                    }>
                                        <Text style={{ fontSize: 18 }}>{bank}</Text>
                                        <Image
                                            source={image}
                                            style={{ width: 25, height: 25 }} resizeMode="contain"
                                        />
                                    </View>
                                </Pressable>
                            )
                        })
                    }
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    )
});

