import { TextThemeProps } from './types';
import { Text as DefaultText } from 'react-native';
import { twMerge } from 'tailwind-merge';


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
    return <DefaultText style={[{ fontFamily: fontFamily[font], fontSize: 16 }, style]} className={
        twMerge('text-gray-900 dark:text-gray-100', componentClass)
    } {...otherProps} />;
}

export const HeadingText = (props: TextProps) => {
    const { font = 'bold' } = props;
    return <Text font={font} style={{ fontSize: 29 }} {...props} />
}

export const SubHeading = (props: TextProps) => {
    return <Text style={{ fontSize: 20 }} {...props} />
}