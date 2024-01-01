import Modal from 'react-native-modal';
import { FC, PropsWithChildren } from 'react';
import { SubHeading, Text } from '../themed/Text';
import { View } from '../themed/View';
import { useDeviceHeightFormModal } from '@app/hooks/useDeviceHeightFormModal';

interface Props extends PropsWithChildren {
    show: boolean;
    containerStyle?: string;
    message?: string;
    title?: string;
    closeModal?: () => void;
}


export const PopupModal: FC<Props> = (props) => {
    const { children, show, message, title, closeModal } = props;
    const deviceHeight = useDeviceHeightFormModal();

    return (
        <Modal
            onBackdropPress={closeModal}
            deviceHeight={deviceHeight}
            isVisible={show}
            statusBarTranslucent
            style={{ justifyContent: 'flex-end', margin: 0 }}
            animationInTiming={600}
            swipeDirection="down"
            onSwipeComplete={closeModal}
        >
            <View className='px-4 flex-col rounded-t-3xl py-3'>

                <View className='flex flex-col items-center'>
                    <View className='h-1 rounded-sm w-10 bg-gray-500 dark:bg-gray-500 mb-3'></View>
                    {
                        title && (
                            <SubHeading font='bold'>{title}</SubHeading>
                        )
                    }
                    {
                        message && (
                            <Text>{message}</Text>
                        )
                    }
                    {children}
                </View>
            </View>
        </Modal>
    )
}