type ATMType = "BNS" | "NCB" | "JMMB" | "JN" | "VM" | "FGB" | "Sagicor" | "CIBC";
type ATM = {
    id: string; 
    displayName: string; 
    shortFormattedAddress: string;
    atmType: ATMType, 
    isOnline: boolean; 
    statusInfo: string; 
    lastSubmissionAt?: string; 
    latitude: number; 
    longitude: number;
}