import Constants from "expo-constants";
export const useExpoConfigs = () => {
    const version = Constants.expoConfig?.version;
    const appName = Constants.expoConfig?.name;
    const sdkVersion = Constants.expoConfig?.sdkVersion;
    const slug = Constants.expoConfig?.slug;


    return { version, appName, sdkVersion, slug }
}