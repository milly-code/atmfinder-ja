import { ATM, ATMType } from "@types";

export type AtmDataState = {
    data: ATM[];
    selectedAtm?: ATM;
    filteredAtmType?: ATMType;
    isBusy: boolean;
}