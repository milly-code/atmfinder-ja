import Colors from "@app/constants/Colors";
import { useColorScheme as useAppColorScheme } from "react-native"

export const useColorScheme = () => {
    const colourScheme = useAppColorScheme() ?? 'light';
    const themeColours = Colors[colourScheme];
    return { colourScheme, themeColours };
}