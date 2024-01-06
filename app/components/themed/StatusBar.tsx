import { useColorScheme } from "@app/hooks/useColorScheme";
import { StatusBar as DefaultStatusBar } from "expo-status-bar";
export const StatusBar = () => {
    const { colourScheme } = useColorScheme();
    return (
        <DefaultStatusBar style={colourScheme === 'dark' ? 'light' : 'dark'} />
    )
}