import { TextThemeProps } from './types';
import { Text as DefaultText } from 'react-native';
import { useThemeColor } from '@app/hooks/useThemeColor';


const fontFamily = {
    regular: 'Nunito-Regular',
    bold: 'Nunito-Bold',
    medium: 'Nunito-Medium',
    light: 'Nunito-Light'
}


type TextProps = TextThemeProps & {
    font?: keyof typeof fontFamily,
    componentClass?: string;
    color?: string;
}


export const Text = ({ ...props }: TextProps) => {
    const { font = 'regular', componentClass = '', style, lightColor, darkColor, ...otherProps } = props;
    const color = props.color ?? useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    return <DefaultText style={[{ color }, { fontFamily: fontFamily[font], fontSize: 16 }, style]} className={componentClass} {...otherProps} />;
}

export const HeadingText = (props: TextProps) => {
    const { font = 'bold' } = props;
    return <Text font={font} style={{ fontSize: 29 }} {...props} />
}

export const SubHeading = (props: TextProps) => {
    return <Text style={{ fontSize: 20 }} {...props} />
}