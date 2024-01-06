import { Toast } from "@backpackapp-io/react-native-toast";
import { FC } from "react";
import { View } from "./themed/View";
import { ActivityIndicator } from "react-native";
import { Text } from "./themed/Text";
import { FontAwesome } from "@expo/vector-icons";


type CustomHeight = `h-[${number}px]`;

type ToastProps = FC<Toast & { customHeight?: CustomHeight }>;

export const PromiseToast: ToastProps = ({ width, message, customHeight }) => {
    return (
        <View style={{ width: width }} className={`flex items-center border border-gray-200 p-2 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ${customHeight ?? ''}`}>
            <View className="w-full h-full items-start bg-white dark:bg-gray-800 flex flex-row">
                <View className="flex-shrink-0 mt-0.5">
                    <ActivityIndicator color={"#3b82f6"} size={20} />
                </View>
                <View className="flex-1 px-2">
                    <Text componentClass="text-gray-700 dark:text-gray-400">{message?.toString()}</Text>
                </View>
            </View>
        </View>
    )
}

export const SuccessToast: ToastProps = ({ width, message, customHeight }) => {

    return (
        <View style={{ width: width }} className={`flex items-center border border-gray-200 p-2 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ${customHeight ?? ''}`}>
            <View className="w-full h-full items-start bg-white dark:bg-gray-800 flex flex-row">
                <View className="flex-shrink-0 mt-0.5">
                    <FontAwesome name="check-circle" size={20} color={"#14B8A6"} />
                </View>
                <View className="flex-1 px-2">
                    <Text componentClass="text-gray-700 dark:text-gray-400">{message?.toString()}</Text>
                </View>
            </View>
        </View>
    )
}

export const ErrorToast: ToastProps = ({ width, message, customHeight }) => {

    return (
        <View style={{ width: width }} className={`flex items-center border border-gray-200 p-2 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ${customHeight ?? ''}`}>
            <View className="w-full h-full items-start bg-white dark:bg-gray-800 flex flex-row">
                <View className="flex-shrink-0 mt-0.5">
                    <FontAwesome name="exclamation-circle" size={20} color={"#EF4444"} />
                </View>
                <View className="flex-1 px-2">
                    <Text componentClass="text-gray-700 dark:text-gray-400">{message?.toString()}</Text>
                </View>
            </View>
        </View>
    )
}
export const InfoToast: ToastProps = ({ width, message, customHeight }) => {

    return (
        <View style={{ width: width }} className={`flex items-center border border-gray-200 p-2 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ${customHeight ?? ''}`}>
            <View className="w-full h-full items-start bg-white dark:bg-gray-800 flex flex-row">
                <View className="flex-shrink-0 mt-0.5">
                    <FontAwesome name="info-circle" size={20} color={"#3b82f6"} />
                </View>
                <View className="flex-1 px-2">
                    <Text componentClass="text-gray-700 dark:text-gray-400">{message?.toString()}</Text>
                </View>
            </View>
        </View>
    )
}