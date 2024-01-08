import { useExpoConfigs } from '@app/hooks/useExpoConfigs';
import analytics from '@react-native-firebase/analytics';

type AnalyticsEventPayload = {
    slug?: string;
    app: 'android',
    version?: string;
    sdk?: string;
    action?: string;
    error_updating_atm?: string;
    error_description?: string;
    method?: string;
    error_fetch_atms?: string;
}

type AnonymousSignInFailedEvent = {
    event: 'anonymous_signin_failed';
    error: string;
}

type FetchAtmErrorEvent = {
    event: 'error_fetching_atms',
    error: string;
}

type SubmitButtonPressedEvent = {
    event: 'submit_button_pressed',
    action?: 'success' | 'not_in_range' | 'error';
    error_updating_atm?: string;
}

type EventWithoutPayload = {
    event: 'directions_button_pressed' | 'signup_button_pressed' | 'recenter_map_pressed'
}

type LogEventType = EventWithoutPayload | AnonymousSignInFailedEvent | SubmitButtonPressedEvent | FetchAtmErrorEvent;

export const logFirebaseAnalyticsEvent = async (props: LogEventType) => {
    const { slug, version, sdkVersion } = useExpoConfigs();
    try {
        const payload: AnalyticsEventPayload = {
            slug: slug,
            app: 'android',
            version: version,
            sdk: sdkVersion,
        }

        const { event } = props;

        switch (event) {
            case 'recenter_map_pressed':
                payload.action = 'location_disabled';
                break;
            case 'directions_button_pressed':
                payload.action = 'open_in_maps';
                break;
            case 'signup_button_pressed':
                payload.method = 'anonymous';
                break;
            case 'error_fetching_atms':
            case 'anonymous_signin_failed':
                payload.error_description = props.error;
                break;
            case 'submit_button_pressed':
                payload.action = props.action;
                payload.error_updating_atm;
                break;
            default:
                break;
        }
        await analytics().logEvent(event, payload);
    } catch (e) {
        //Unable to log event; 
        console.log(e);
    }
}