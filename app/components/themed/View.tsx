import { View as DefaultView } from 'react-native';
import { ViewProps } from "./types";
import { twMerge } from 'tailwind-merge';


export const View = (props: ViewProps) => {
    const { style, className, ...otherProps } = props;
    return <DefaultView style={style} className={
        twMerge('dark:bg-gray-800', className)
    } {...otherProps} />;
}