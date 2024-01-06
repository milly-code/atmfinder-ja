import { ATMType } from "@types";

type Bank = {
    bank: string;
    image: any,
    code: ATMType
}

const banks: Bank[] = [
    {
        bank: "Scotiabank",
        image: require("../../assets/banks/bns-2.png"),
        code: "BNS"
    },
    {
        bank: "National Commercial Bank",
        image: require("../../assets/banks/ncb-2.png"),
        code: "NCB"
    },
    {
        bank: "Victoria Mutual",
        image: require("../../assets/banks/vmbs-2.png"),
        code: "VM"
    },
    {
        bank: "JMMB",
        image: require("../../assets/banks/jmmb-2.png"),
        code: "JMMB"
    },
    {
        bank: "Jamaica National Bank",
        image: require("../../assets/banks/jnb-2.png"),
        code: "JN"
    },
    {
        bank: "First Global Bank",
        image: require("../../assets/banks/fgb-2.png"),
        code: "FGB"
    },
    {
        bank: "Sagicor",
        image: require("../../assets/banks/sagicor-2.png"),
        code: "Sagicor"
    },
    {
        bank: "FCIBC",
        image: require("../../assets/banks/cibc-2.png"),
        code: "CIBC"
    },
]
export default banks;