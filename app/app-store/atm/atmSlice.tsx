import { ATM, ATMStatus, ATMType } from "@types";
import { AtmDataState } from "./types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { toast } from '@backpackapp-io/react-native-toast';
import moment from "moment";
import { ErrorToast, InfoToast, PromiseToast, SuccessToast } from "@app/components/Toasts";

type ATMCollectionRef = FirebaseFirestoreTypes.CollectionReference<ATM & {
    lastSubmissionAt?: FirebaseFirestoreTypes.Timestamp;
}>;

type AtmQuerySnapshot = FirebaseFirestoreTypes.QuerySnapshot<ATM & {
    lastSubmissionAt?: FirebaseFirestoreTypes.Timestamp | undefined;
}>

const COLLECTION_PATH = 'atms';
const initialState: AtmDataState = { data: [], isBusy: false };

const atmSlicer = createSlice({
    name: "atm",
    initialState,
    reducers: {
        setCurrentViewingAtm: (state, action: PayloadAction<ATM | undefined>) => {
            state.selectedAtm = action.payload;
        },
        setAtmTypeFilter: (state, action: PayloadAction<ATMType | undefined>) => {
            state.filteredAtmType = action.payload;
            state.selectedAtm = undefined;
        }

    },
    extraReducers: (builder) => {
        builder
            //TODO: Figure out why these not working
            // .addCase(updateAtmStatusAsync.pending, (state) => {
            //     toast.loading('ATM Status updating...');
            //     state.isBusy = true;
            // })
            // .addCase(updateAtmStatusAsync.rejected, (state, action) => {
            //     toast.dismiss();
            //     state.isBusy = false;
            //     toast.error(action.error.message ?? "Unable to retrieve updated ATMs at this time. Try again, and if the issue persists contact support.", { duration: 10000 });
            // })
            // .addCase(updateAtmStatusAsync.fulfilled, (state, action: PayloadAction<ATM>) => {
            //     toast.dismiss();
            //     toast.success("Thanks for submitting! Eact contribution helps to keep you and the community up to date.");
            //     state.selectedAtm = action.payload;
            //     state.isBusy = false;
            //     state.data = state.data.map((atm) => (atm.id === action.payload.id ? action.payload : atm));
            // })
            // .addCase(fetchAtmDataAsync.pending, () => {
            //     toast.loading('Map updating...');
            // })
            // .addCase(fetchAtmDataAsync.rejected, (_, action) => {
            //     if (action.error.message) {
            //         toast.error(action.error.message ?? '', { duration: 6000 });
            //     }
            //     toast.error("Unable to retrieve updated ATMs at this time. Try again, and if the issue persists contact support.", { duration: 10000 });
            // })
            .addCase(
                fetchAtmDataAsync.fulfilled,
                (state, action: PayloadAction<ATM[]>) => {
                    // toast.dismiss();
                    // toast.success("ATM Statuses updated.", { duration: 4000 });
                    state.data = action.payload;
                }
            );
    },
});


export const updateAtmStatusAsync = createAsyncThunk<ATM, { id: string, statusInfo: ATMStatus }>(
    'atm/updateAtmStatus',
    async ({ id, statusInfo }) => {
        //TODO: this fails whenever I call it. 
        const currentDate = new Date(Date.now());
        const document = firebase().collection<ATM>(COLLECTION_PATH).doc(id);
        await document.update({
            statusInfo: statusInfo,
            lastSubmissionAt: FirebaseFirestoreTypes.Timestamp.fromDate(currentDate)
        });

        const atm = (await document.get()).data();

        if (!atm) {
            //TODO: don't want to throw error here.
            throw new Error("Hmm... Unexpected error occured. Try again, and if the issue persists contact support.");
        }

        return {
            ...atm,
            id: document.id,
            lastSubmissionAt: moment().startOf('date').from(currentDate)
        };
    }
)

export const fetchAtmDataAsync = createAsyncThunk<ATM[], undefined>(
    "atm/fetchAtmData",
    async () => {

        const queryCollection: ATMCollectionRef = firebase().collection(COLLECTION_PATH);

        const documentCollection = await toast.promise<AtmQuerySnapshot>(queryCollection.get(), {
            error: (err) => {
                console.log(err);
                return "Unable to retrieve updated ATMs at this time. Try again, and if the issue persists contact support.";
            } ,
            success: "ATM Statuses updated.",
            loading: "Map data updating. Please wait...",
        }, {
            customToast: (props) => {
                if (props.type === 'error') {
                    return <ErrorToast {...props} customHeight='h-[90px]' />
                }
                else if (props.type === 'loading') {
                    return <PromiseToast {...props} />
                }
                else if (props.type === 'success') {
                    return <SuccessToast {...props} />
                }
                return <InfoToast {...props} />
            }
        });

        return documentCollection.docs.map((doc) => {
            const atm = doc.data();
            const lastSubmissionAt = atm.lastSubmissionAt ?
                moment().startOf('date').from(new Date((atm.lastSubmissionAt as FirebaseFirestoreTypes.Timestamp).seconds * 1000))
                : undefined;
            return {
                id: doc.id,
                displayName: atm.displayName,
                shortFormattedAddress: atm.shortFormattedAddress,
                atmType: atm.atmType,
                isOnline: atm.isOnline,
                latitude: atm.latitude,
                longitude: atm.longitude,
                statusInfo: atm.statusInfo,
                appType: atm.appType,
                lastSubmissionAt: lastSubmissionAt
            }
        })
    }
);


export const { setAtmTypeFilter, setCurrentViewingAtm } = atmSlicer.actions;

export default atmSlicer.reducer;