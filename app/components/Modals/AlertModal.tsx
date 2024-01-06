import { twJoin } from 'tailwind-merge';
import RNModal from 'react-native-modal';
import { Pressable } from 'react-native';
import { FC, PropsWithChildren } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View } from '@app/components/themed/View';
import { useColorScheme } from '@app/hooks/useColorScheme';
import { SubHeading, Text } from '@app/components/themed/Text';
import { useDeviceHeightFormModal } from '@app/hooks/useDeviceHeightFormModal';

type Action = {
    onPress: () => void;
    title?: string
}


type Props = {
    show: boolean;
    title?: string;
    onBackdropPress?: () => void;
    primaryAction?: Action;
    secondaryAction?: Action;
    message?: string;
    type?: 'success' | 'error' | 'message'
} & PropsWithChildren

export const AlertModal: FC<Props> = (props) => {
    const { themeColours } = useColorScheme();
    const { primaryAction, secondaryAction, show, children, title, onBackdropPress, message, type = 'message' } = props;

    const deviceHeight = useDeviceHeightFormModal();

    return (
        <RNModal
            statusBarTranslucent
            deviceHeight={deviceHeight}
            onBackdropPress={onBackdropPress}
            isVisible={show}
            animationInTiming={600}
            className={"justify-center flex m-0 self-center flex-col w-10/12 relative"}
        >
            {
                type !== 'message' && (
                    <View className='h-14 w-14 rounded-full bg-green-50 dark:bg-gray-800 border border-green-800 items-center justify-center relative mx-auto top-5 z-10'>
                        <Ionicons name='information-outline' color={themeColours.success} size={25} />
                    </View>
                )
            }
            <View className='overflow-hidden bg-green-50 dark:bg-gray-800 px-4 flex-col max-h-[95%] rounded-t-3xl rounded-2xl p-0 pt-2 pb-3'>
                <View className='justify-center items-center mt-5 bg-green-50 dark:bg-gray-800'>
                    {title && (<SubHeading font='bold' componentClass={
                        twJoin(
                            'text-center',
                            type === 'success' ?
                                'text-green-800 dark:text-green-400'
                                : ''
                        )
                    }>{title}</SubHeading>)}
                </View>

                <View className='flex flex-col items-center bg-green-50 dark:bg-gray-800'>
                    <View className="flex-col self-center items-center justify-center w-full bg-green-50 dark:bg-gray-800 mb-5">
                        {
                            message && (
                                <View className='justify-center items-center w-10/12 mt-3 bg-green-50 dark:bg-gray-800'>
                                    <Text className={
                                        twJoin(
                                            'text-center',
                                            type === 'success' ?
                                                'text-green-800 dark:text-green-400'
                                                : ''
                                        )
                                    }>{message}</Text>
                                </View>
                            )
                        }
                        {children}
                        {
                            (primaryAction || secondaryAction) && (
                                <View className="flex-row w-full space-x-4 px-3 py-2 mt-5 justify-center bg-green-50 dark:bg-gray-800">
                                    {secondaryAction && (
                                        <Pressable onPress={secondaryAction.onPress} className='border border-red-700 rounded-lg w-1/3 px-2 py-2.5  items-center justify-center dark:border-red-500'>
                                            <Text componentClass='uppercase text-red-700 dark:text-red-500'>{secondaryAction.title ?? 'Cancel'}</Text>
                                        </Pressable>
                                    )}
                                    {primaryAction && (
                                        <Pressable onPress={primaryAction.onPress} className='bg-green-700 rounded-lg w-1/3 px-2 py-2.5 items-center justify-center dark:bg-green-600'>
                                            <Text componentClass='uppercase text-white'>{primaryAction.title ?? 'Ok'}</Text>
                                        </Pressable>
                                    )}
                                </View>
                            )
                        }
                    </View>
                </View>
            </View>
        </RNModal>
    )
}