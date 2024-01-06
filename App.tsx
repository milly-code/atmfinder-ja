import * as Font from 'expo-font';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { AppLayout } from '@app/Layout';
import Fonts from '@app/constants/Fonts';
import { atmStore } from '@app/app-store';
import { useEffect, useState } from 'react';
import { View } from '@app/components/themed/View';
import { WelcomeScreen } from '@app/screens/WelcomeScreen';
import { useColorScheme } from '@app/hooks/useColorScheme';
import { SplashScreen } from '@app/components/SplashScreen';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { StatusBar } from '@app/components/themed/StatusBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';

type AuthUser = FirebaseAuthTypes.User | null;

export default function App() {
	const { colourScheme } = useColorScheme();
	const [fonstLoaded, _] = Font.useFonts(Fonts);
	const [appIsReady, setAppIsReady] = useState<boolean>(false);
	const [authUser, setAuthUser] = useState<AuthUser>();


	const onAuthStateChanged = (user: AuthUser) => {
		setAuthUser(user);
		if (!appIsReady) {
			setAppIsReady(true);
		}
	}

	useEffect(() => {
		const authSubscription = auth().onAuthStateChanged(onAuthStateChanged);
		return authSubscription;
	}, []);

	if (!appIsReady || !fonstLoaded) {
		return <SplashScreen />
	}


	return (
		<ThemeProvider value={colourScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<SafeAreaProvider>
				<StatusBar />
				<View className='h-screen'>
					<Provider store={atmStore}>
						<GestureHandlerRootView style={{ flex: 1 }}>
							{
								authUser ? (
									<NavigationContainer>
										<AppLayout />
									</NavigationContainer>
								) : (
									<WelcomeScreen />
								)
							}
							<Toasts />
						</GestureHandlerRootView>
					</Provider>
				</View>
			</SafeAreaProvider>
		</ThemeProvider>
	);
}


