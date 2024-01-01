import { StackCardInterpolationProps } from "@react-navigation/stack";
import { Animated } from "react-native";

export const useCardStyleInterpolator = ({ current, next, layouts }: StackCardInterpolationProps) => {
    const progress = Animated.add(
        current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp",
        }),
        next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: "clamp",
            })
            : 0
    );

    return {
        cardStyle: {
            backgroundColor: "#ffffff",
            transform: [
                {
                    translateX: Animated.multiply(
                        progress.interpolate({
                            inputRange: [0, 1, 2],
                            outputRange: [layouts.screen.width, 0, -layouts.screen.width],
                        }),
                        -1 // invert direction
                    ),
                },
            ],
        },
        overlayStyle: {
            opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: "clamp",
            }),
        },
    };
};
