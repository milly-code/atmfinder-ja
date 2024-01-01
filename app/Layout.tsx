import { TransitionSpecs, createStackNavigator } from "@react-navigation/stack";
import { useCardStyleInterpolator } from "./hooks/useCardStyleInterpolator";
import { MapScreen } from "./screens/MapScreen";

type AppRoutes = {
    map: undefined,
}


const AppNavigator = createStackNavigator<AppRoutes>();

export const AppLayout = () => {
    
    return (
        <AppNavigator.Navigator
            initialRouteName={'map'}
            screenOptions={{
                gestureEnabled: false,
                gestureDirection: 'horizontal-inverted',
                transitionSpec: {
                    open: TransitionSpecs.TransitionIOSSpec,
                    close: TransitionSpecs.TransitionIOSSpec
                },
                cardStyleInterpolator: useCardStyleInterpolator,
                headerShown: false,
            }}
        >
            <AppNavigator.Screen name="map" component={MapScreen} />
        </AppNavigator.Navigator>
    )
}