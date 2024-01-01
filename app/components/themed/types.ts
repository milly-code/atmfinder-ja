import { Text, View } from "react-native";

export type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type TextThemeProps = ThemeProps & Text['props'];
export type ViewProps = ThemeProps & View['props'];
