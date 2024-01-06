import { ATM, ATMType } from "@types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, fetchAtmDataAsync, setAtmTypeFilter, setCurrentViewingAtm } from "@app/app-store";

export const useAppStoreState = () => {
    const { data, filteredAtmType, selectedAtm, isBusy } = useSelector((state: RootState) => state.atm);
    const dispatch = useDispatch<AppDispatch>();

    const fetchAtmData = () => {
        dispatch(fetchAtmDataAsync());
    }

    const viewAtm = (atm: ATM) => {
        dispatch(setCurrentViewingAtm(atm));
    }

    const clearViewingAtm = () => {
        dispatch(setCurrentViewingAtm());
    }

    const filterAtmByType = (type: ATMType) => {
        dispatch(setAtmTypeFilter(type));
    }

    const clearAtmFilterType = () => {
        dispatch(setAtmTypeFilter());
    }

    // const updateAtmStatus = (id: string, newStatus: ATMStatus) => {
    //     dispatch(updateAtmStatusAsync({ id: id, statusInfo: newStatus }))
    // }


    return {
        atms: data,
        filteredAtmType,
        viewingAtm: selectedAtm,
        fetchAtmData,
        viewAtm,
        clearViewingAtm,
        setAtmTypeFilter: filterAtmByType,
        clearAtmFilterType,
        isBusy
    }

}