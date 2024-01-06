import { View } from "./themed/View";
import { twJoin } from "tailwind-merge";
import { ATM, ATMStatus } from "@types";
import { Pressable } from "react-native";
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
import { ErrorToast, InfoToast, PromiseToast, SuccessToast } from "./Toasts";
import GorhomBottomSheet, { BottomSheetScrollView, useBottomSheet } from "@gorhom/bottom-sheet";

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
            <BasicDetailsView expanded={expanded} {...viewingAtm} />
        </BottomSheet>
    )
})


type DetailsProps = Partial<ATM> & { expanded: boolean };

const BasicDetailsView: FC<DetailsProps> = (props) => {
    const { isOnline, lastSubmissionAt, expanded, displayName, shortFormattedAddress, statusInfo, latitude, longitude, id } = props;

    const { expand } = useBottomSheet();

    const onIconPressed = () => {
        if (!expanded) {
            expand()
        } else {
            const openMapLink = createOpenLink({
                latitude: latitude,
                longitude: longitude,
                start: "My Location",
                navigate: true, end: shortFormattedAddress
            });
            openMapLink();
        }
    }
    const truncate = (str: string, length = 23) => str.length > length ? str.slice(0, length) + '...' : str;
    //bg-blue-700 dark:bg-blue-600
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
                        <View><UpdateAtmStatusForm atmStatus={statusInfo} id={id} /></View>
                    )
                }
            </View>
        </BottomSheetScrollView>
    )
}



const UpdateAtmStatusForm: FC<{ atmStatus?: ATMStatus, id?: string }> = ({ atmStatus, id }) => {
    const { close } = useBottomSheet();
    const [selectedStatus, setSelectedStatus] = useState<ATMStatus | undefined>(atmStatus);
    const atmStatuses: ATMStatus[] = ["Working", "Not Working", "Out of Cash", "Works But Takes Forever", "No Longer at Listed Location"];
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const { fetchAtmData } = useAppStoreState();

    const onSubmit = async () => {
        if (selectedStatus && id) {



            setIsBusy(true);
            // const toastId = toast.loading('ATM Status updating...');
            try {
                const currentDate = new Date(Date.now());
                const document = firebase().collection('atms').doc(id);
                // await ;

                await toast.promise(document.update({
                    statusInfo: selectedStatus,
                    lastSubmissionAt: currentDate
                }), {
                    error: (err) => {
                        console.log(err);
                        return "Hmm... Unexpected error occured. Try again, and if the issue persists contact support.";
                    },
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

                // toast.dismiss(toastId);
                // toast.success("Thanks for submitting! Eact contribution helps to keep you and the community up to date.");
                // TODO: need to update the current viewing ATM instead of closing the bottomsheet. 
                // This way user sees the update before the fetch finish;
                // const atm: ATM & {
                //     lastSubmissionAt?: FirebaseFirestoreTypes.Timestamp;
                // } | undefined = (await document.get()).data() as ATM & {
                //     lastSubmissionAt?: FirebaseFirestoreTypes.Timestamp;
                // } | undefined;

                // if (!atm) {
                //     //TODO: don't want to throw error here.
                //     throw new Error("Hmm... Unexpected error occured. Try again, and if the issue persists contact support.");
                // }

                close();
                fetchAtmData();
            } catch (e) {
                console.log(e);
                toast.error("Unable to update ATM status at this time. Try again, and if the issue persists contact support.", { duration: 10000, customToast: (props) => <ErrorToast {...props} customHeight='h-[90px]' /> });
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
                                    if (selectedStatus === atmStatus) {
                                        setSelectedStatus(undefined);
                                    } else {
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