export * from './getUserCurrentLocation';
export * from './checkIfAtmIsWithinRange';

export const truncate = (str: string, length = 23) => str.length > length ? str.slice(0, length) + '...' : str;