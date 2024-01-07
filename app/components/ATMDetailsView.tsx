import { View } from "./themed/View";
import { twJoin } from "tailwind-merge";
import { ATM, ATMStatus } from "@types";
import { Pressable } from "react-native";
import { LatLng } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { ToggleSwitch } from "./ToggleSwitch";
import { ButtonPrimary } from "./themed/Buttons";
import { FC, forwardRef, useState } from "react";
import { BottomSheet } from "./themed/BottomSheet";
import firebase from '@react-native-firebase/firestore';
import { createOpenLink } from 'react-native-open-maps';
import { toast } from "@backpackapp-io/react-native-toast";
import { CaptionText, SubHeading, Text } from "./themed/Text";
import { useAppStoreState } from "@app/hooks/useAppStoreState";
import { RangeStatusError, checkIfAtmIsWithinRange, truncate } from "@app/helpers";
import { ErrorToast, InfoToast, PromiseToast, SuccessToast } from "./Toasts";
import GorhomBottomSheet, { BottomSheetScrollView, useBottomSheet } from "@gorhom/bottom-sheet";
import { logFirebaseAnalyticsEvent } from "@app/helpers/firebaseAnalytics";

export const ATMDetailsView = forwardRef<GorhomBottomSheet>((_, bottomSheetRef) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const onBottomSheetChange = (index: number) => {
        setExpanded(index === 1);
    }

    const { clearViewingAtm, viewingAtm } = useAppStoreState();

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={['20%', '80%']}
            enablePanDownToClose={false}
            onClose={clearViewingAtm}
            onChange={onBottomSheetChange}
        >
            <BasicDetailsView atm={viewingAtm} expanded={expanded} />
        </BottomSheet>
    )
})


type DetailsProps = {
    atm?: ATM;
    expanded: boolean;
};

const BasicDetailsView: FC<DetailsProps> = (props) => {
    const { expand } = useBottomSheet();
    const { expanded, atm } = props;
    if (!atm) {
        return null;
    }

    const { isOnline, lastSubmissionAt, displayName, shortFormattedAddress, statusInfo, latitude, longitude, id } = atm;

    const onIconPressed = async () => {
        if (!expanded) {
            expand()
        } else {
            await logFirebaseAnalyticsEvent({ event: 'directions_button_pressed' });
            const openMapLink = createOpenLink({
                latitude: latitude,
                longitude: longitude,
                start: "My Location",
                navigate: true, end: shortFormattedAddress
            });
            openMapLink();
        }
    }

    return (
        <BottomSheetScrollView>
            <View className='flex-col px-5 space-y-2'>
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center space-x-2">
                        <View className={
                            twJoin(
                                "w-3 h-3 rounded-full",
                                isOnline ? "bg-green-700 dark:bg-green-600" : "bg-red-700 dark:bg-red-600"
                            )
                        }></View>
                        <View className="flex-wrap"><SubHeading font="bold">{truncate(displayName ?? '')}</SubHeading></View>
                    </View>
                    <Pressable onPress={onIconPressed}>
                        <View className="p-1 rounded-md bg-blue-500/30 dark:bg-blue-300/30">
                            <Ionicons
                                name={expanded ? "navigate-circle" : "chevron-up-circle"}
                                size={30}
                                color={"#8bb6fc"}
                            />
                        </View>
                    </Pressable>
                </View>
                {
                    !expanded ? (
                        <View className="space-y-2">
                            <View>
                                <Text>{shortFormattedAddress}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <CaptionText>{statusInfo}</CaptionText>
                                {
                                    lastSubmissionAt && (
                                        <CaptionText>{lastSubmissionAt}</CaptionText>
                                    )
                                }
                            </View>
                        </View>
                    ) : (
                        <View>
                            <UpdateAtmStatusForm
                                atmStatus={statusInfo}
                                id={id}
                                cords={{
                                    latitude: latitude,
                                    longitude: longitude,
                                }}
                            />
                        </View>
                    )
                }
            </View>
        </BottomSheetScrollView>
    )
}


type FormProps = {
    atmStatus: ATMStatus;
    id: string;
    cords: {
        latitude: number;
        longitude: number;
    }
};
const UpdateAtmStatusForm: FC<FormProps> = ({ atmStatus, id, cords }) => {
    const [selectedStatus, setSelectedStatus] = useState<ATMStatus>(atmStatus);
    const { collapse } = useBottomSheet();
    const atmStatuses: ATMStatus[] = ["Working", "Not Working", "Out of Cash", "Works But Takes Forever", "No Longer at Listed Location"];
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const { fetchAtmData } = useAppStoreState();

    const checkAndUpdate = async (atmPosition: LatLng, documentId: string, distanceInKm?: number) => {
        const rangeStatus = await checkIfAtmIsWithinRange(atmPosition, distanceInKm);
        if (rangeStatus !== 'within-range') {
            const message =
                rangeStatus === 'location-disabled' ? "Sorry, you need to enable location to update an ATM status."
                    : rangeStatus === 'not-in-range' ? "Sorry, you need to be in proximity of the ATM to update its status. "
                        : rangeStatus === 'error' ? "Unable to update ATM status at this time. Try again, and if the issue persists contact support."
                            : "";
            throw new RangeStatusError(rangeStatus, message);
        }
        const currentDate = firebase.Timestamp.now().toDate();
        const document = firebase().collection('atms').doc(documentId);
        await document.update({
            statusInfo: selectedStatus,
            lastSubmissionAt: currentDate
        });
        await logFirebaseAnalyticsEvent({ event: 'submit_button_pressed', action: 'success' });
        return true;
    }

    const onSubmit = async () => {
        setIsBusy(true);

        if (selectedStatus) {

            try {
                const response = await toast.promise(checkAndUpdate(cords, id), {
                    error: (err) =>
                        err instanceof RangeStatusError ? err.message
                            : "Unable to update ATM status at this time. Try again, and if the issue persists contact support.",
                    success: "Thanks for submitting! Eact contribution helps to keep you and the community up to date.",
                    loading: "ATM Status updating...",
                }, {
                    customToast: (props) => {
                        if (props.type === 'error') {
                            return <ErrorToast {...props} customHeight='h-[90px]' />
                        }
                        else if (props.type === 'loading') {
                            return <PromiseToast {...props} />
                        }
                        else if (props.type === 'success') {
                            return <SuccessToast {...props} customHeight='h-[90px]' />
                        }
                        return <InfoToast {...props} />
                    }
                });

                if (response) {
                    //Only fetch if there isn't an error;
                    fetchAtmData();
                }
            } catch (e) {
                if (e instanceof RangeStatusError) {
                    await logFirebaseAnalyticsEvent({ event: 'submit_button_pressed', action: 'not_in_range' });
                } else {
                    await logFirebaseAnalyticsEvent({ event: 'submit_button_pressed', error_updating_atm: String(e), action: 'error' });
                }
                collapse();
            }

            setIsBusy(false);
        }
    }
    return (
        <View className="space-y-3 flex-col">
            <View className="items-center mb-2">
                <CaptionText componentClass="text-center mt-2 w-10/12 text-gray-700 dark:text-gray-400">
                    Submitting the current status  of ATMs you visit helps to keep the community informed. Thank you for contributing!
                </CaptionText>
            </View>

            <View><Text font="bold">Update ATM Status Below</Text></View>
            <View className="flex-col space-y-3">
                {
                    atmStatuses.map((atmStatus, index) => {
                        return (
                            <View className="flex-row justify-between px-2 items-center py-2.5" key={index}>
                                <Text style={{ fontSize: 18 }}>{atmStatus}</Text>
                                <ToggleSwitch handleOnPress={() => {
                                    if (selectedStatus !== atmStatus) {
                                        setSelectedStatus(atmStatus);
                                    }
                                }} isActive={selectedStatus === atmStatus} />
                            </View>
                        )
                    })
                }

            </View>
            <View className="pt-16">
                <ButtonPrimary
                    disabled={atmStatus === selectedStatus}
                    onPress={onSubmit}
                    isBusy={isBusy}
                    componentClass="bg-blue-700 dark:bg-blue-600"
                >
                    Submit
                </ButtonPrimary>
            </View>
        </View>
    )
}