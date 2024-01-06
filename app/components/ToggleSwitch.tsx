import { Pressable, View } from 'react-native';
import Animated, { withSpring, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useColorScheme } from '@app/hooks/useColorScheme';


const SPRING_CONFIG = {
    mass: 1,
    damping: 15,
    stiffness: 120,
    overshootClamping: true,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
}
interface Props {
    handleOnPress: (value: boolean) => void;
    isActive: boolean;
}

export const ToggleSwitch = ({
    handleOnPress,
    isActive,
}: Props) => {
    const offset = useSharedValue(1);
    const { colourScheme } = useColorScheme();
    const activeTrackColor = "#1c64f2";
    const inActiveTrackColor = colourScheme === 'dark' ? '#374151' : "#1f2937";
    const thumbColor = "#e6edff";

    useEffect(() => {
        const springValue = isActive ? 24 : 1;
        offset.value = withSpring(springValue, SPRING_CONFIG);
    }, [isActive, offset])

    const interpolateBackgroundColor = { backgroundColor: isActive ? activeTrackColor : inActiveTrackColor };

    const animatedCircleStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: offset.value },], };
    });

    return (
        <View className='flex flex-col items-start '>
            <Pressable onPress={async () => { handleOnPress(!isActive); }}>
                <Animated.View className="w-12 rounded-2xl p-0.5" style={[interpolateBackgroundColor]}>
                    <Animated.View
                        className="h-5 w-5 rounded-full"
                        style={[
                            { backgroundColor: thumbColor },
                            animatedCircleStyle,
                        ]}
                    />
                </Animated.View>
            </Pressable>
        </View>
    );
};
