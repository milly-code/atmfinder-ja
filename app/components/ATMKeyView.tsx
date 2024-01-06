import { ATMType } from "@types";
import { forwardRef } from 'react';
import { View } from './themed/View';
import Banks from '@app/constants/Banks';
import { Image, Pressable } from 'react-native';
import { SubHeading, Text } from './themed/Text';
import { BottomSheet } from './themed/BottomSheet';
import GorhomBottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

type ATMKeyViewProps = {
    onBankPressed?: (code: ATMType) => void;
}


export const ATMKeyView = forwardRef<GorhomBottomSheet, ATMKeyViewProps>(({ onBankPressed = () => { } }, bottomSheetRef) => {

    return (
        <BottomSheet ref={bottomSheetRef} snapPoints={['70%']} enablePanDownToClose>
            <View className='flex-col items-center'>
                <SubHeading>ATM Keys</SubHeading>
            </View>
            <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-col justify-center my-5 w-full px-4 divide-y divide-gray-200/80 dark:divide-gray-500">
                    {
                        Banks.map(({ bank, image, code }, index) => {
                            return (
                                <Pressable key={index} onPress={() => onBankPressed(code)} className='py-3.5'>
                                    <View className="flex-row justify-between px-2 items-center ">
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

