export type ATMType = "BNS" | "NCB" | "JMMB" | "JN" | "VM" | "FGB" | "Sagicor" | "CIBC";
export type ATMStatus = "Working" | "Not Working" | "Out of Cash" | "Works But Takes Forever" | "No Longer at Listed Location" | "No Submission As Yet";
export type ATM = {
    id: string;
    displayName: string;
    shortFormattedAddress: string;
    atmType: ATMType,
    isOnline: boolean;
    statusInfo: ATMStatus;
    lastSubmissionAt?: string;
    latitude: number;
    longitude: number;
    appType?: 'android'
}