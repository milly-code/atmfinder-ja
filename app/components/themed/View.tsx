import { View as DefaultView } from 'react-native';
import { useThemeColor } from "@app/hooks/useThemeColor";
import { ViewProps } from "./types";


export const View = (props: ViewProps) => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}