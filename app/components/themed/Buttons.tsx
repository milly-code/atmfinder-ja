import { GestureResponderEvent, Pressable, View } from "react-native"
import { Text } from "./Text"
import { FC, PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge";

type ButtonProps = {
    onPress?: (event: GestureResponderEvent) => void;
} & PropsWithChildren & View['props']


export const ButtonPrimary: FC<ButtonProps> = ({ children, onPress, className, ...props }) => {

    return (
        <Pressable onPress={onPress} className={twMerge(
            'bg-green-700 rounded-lg px-2 py-2.5 items-center justify-center dark:bg-green-600',
            className
        )} {...props}>
            <Text componentClass='uppercase text-white'>{children}</Text>
        </Pressable>
    )
}