import Constants from "expo-constants";
import crashlytics from '@react-native-firebase/crashlytics';


class CrashalyticsError extends Error {
    cause?: unknown;
    slug?: string;
    app: string = 'android';
    version?: string;
    sdk?: string;
    message: string;
    constructor(message: string, cause?: unknown) {
        super(message);
        this.message = message;
        this.cause = cause;
        this.slug = Constants.expoConfig?.slug;
        this.app = 'android';
        this.version = Constants.expoConfig?.version;
        this.sdk = Constants.expoConfig?.sdkVersion;
    }
}

export const logFirebaseCrashalyticsEvent = (message: string, error: unknown) => {
    crashlytics().log('Logging new event');
    crashlytics().recordError(new CrashalyticsError(message, error));
}