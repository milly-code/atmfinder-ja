import * as Font from 'expo-font';
import Fonts from '@app/constants/Fonts';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { View } from '@app/components/themed/View';
import { useCallback, useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GoogleMapView } from '@app/components/MapView/GoogleMapView';


SplashScreen.preventAutoHideAsync();

export default function App() {

  const colorScheme = useColorScheme();

  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    const prepareAppLaunch = async () => {
      try {
        await Font.loadAsync(Fonts);
      } catch (e) {
        console.log(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepareAppLaunch();
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View className='flex-1' onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <GoogleMapView />
      </View>
    </ThemeProvider>
  );
}
