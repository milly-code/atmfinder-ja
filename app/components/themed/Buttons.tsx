import { GestureResponderEvent, Pressable, View, PressableProps, ActivityIndicator } from "react-native"
import { Text } from "./Text"
import { FC, PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge";

type ButtonProps = {
    onPress?: (event: GestureResponderEvent) => void;
    componentClass?: string;
    isBusy?: boolean;
} & PropsWithChildren & PressableProps

export const ButtonPrimary: FC<ButtonProps> = ({ children, onPress, componentClass, disabled, isBusy, ...props }) => {

    return (
        <Pressable
            disabled={disabled || isBusy}
            onPress={onPress}
            className={twMerge(
                'bg-green-700 rounded-lg px-2 py-2.5 items-center justify-center dark:bg-green-600',
                (disabled || isBusy) ? 'opacity-50' : '',
                componentClass
            )} {...props}
        >
            {
                isBusy ? (
                    <ActivityIndicator color={"white"} />
                ) :
                    (
                        <Text componentClass='uppercase text-white'>{children}</Text>
                    )
            }
        </Pressable>
    )
}