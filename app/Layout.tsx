import { TransitionSpecs, createStackNavigator } from "@react-navigation/stack";
import { useCardStyleInterpolator } from "./hooks/useCardStyleInterpolator";
import { MapScreen } from "./screens/MapScreen";
import { FC } from "react";
import { WelcomeScreen } from "./screens/WelcomeScreen";

type AppRoutes = {
    map: undefined;
    welcome: undefined;
}


const AppNavigator = createStackNavigator<AppRoutes>();

export const AppLayout: FC<{ isAppFirstLaunch: boolean }> = ({ isAppFirstLaunch }) => {

    return (
        <AppNavigator.Navigator
            initialRouteName={isAppFirstLaunch ? 'welcome' : 'map'}
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
            {
                isAppFirstLaunch && (
                    <AppNavigator.Screen name="welcome" component={WelcomeScreen} />
                )
            }
            <AppNavigator.Screen name="map" component={MapScreen} />
        </AppNavigator.Navigator>
    )
}