import { View } from './View';
import GorhomBottomSheet from '@gorhom/bottom-sheet';
import { PropsWithChildren, forwardRef } from 'react';
import { useColorScheme } from '@app/hooks/useColorScheme';

type Props = {
    snapPoints?: Array<string | number>,
    index?: number;
    enablePanDownToClose?: boolean;
    onClose?: () => void;
    onChange?: (index: number) => void;
} & PropsWithChildren
export const BottomSheet = forwardRef<GorhomBottomSheet, Props>((props, bottomSheetRef) => {
    const { themeColours } = useColorScheme();
    const { children, snapPoints, index = -1, enablePanDownToClose, onClose, onChange } = props;
    return (
        <GorhomBottomSheet
            ref={bottomSheetRef}
            index={index}
            onClose={onClose}
            onChange={onChange}
            snapPoints={snapPoints}
            enablePanDownToClose={enablePanDownToClose}
            backgroundStyle={{ backgroundColor: themeColours.background }}
            handleComponent={() => <View className='flex flex-col items-center mt-2'><View className='h-1 rounded-sm w-7 bg-gray-900 dark:bg-gray-500 mb-3'></View></View>}
        >
            {children}
        </GorhomBottomSheet>
    )
})