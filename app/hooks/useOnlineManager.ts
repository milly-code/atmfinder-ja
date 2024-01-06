import { useEffect, useState } from 'react';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';

export const useOnlineManager = (callback?: () => void) => {
    const [isOffline, setOfflineStatus] = useState(false);
    const [networkType, setNetworkType] = useState<NetInfoStateType>()
    useEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setNetworkType(state.type);
            setOfflineStatus(offline);
        });
        if (callback) {
            callback();
        }
        return () => removeNetInfoSubscription();
    }, [callback]);

    return { isOffline, networkType };
};
