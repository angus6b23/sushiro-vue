export type StoreInfo = {
  id: number;
  storeStatus: string;
  name: string;
  nameKana: string;
  nameEn: string;
  address: string;
  area: string;
  timezone: string;
  latitude: number;
  longitude: number;
  distance: string;
  sortOrder: number;
  wait: number;
  waitTimeCounter: number;
  waitTimeCap: number;
  netTicketStatus: string;
  remoteTicketingManualStatus: string;
  reservationStatus: string;
  checkinStatus: string;
  requireNetTicketLogin: boolean;
  forceLocalMode: boolean;
  counterReservationsAllowed: boolean;
  openDate: any;
  commencementDate: string;
  cancellationMobileMinutes: number;
  cancellationReservationMinutes: number;
  tablesCapacity: number;
  countersCapacity: number;
  maxCustomersMobileTable: number;
  minCustomersMobileTable: number;
  maxCustomersMobileCounter: number;
  minCustomersMobileCounter: number;
  maxCustomersMobileCounter2: number;
  minCustomersMobileCounter2: number;
  maxCustomersMobileCounter3: number;
  minCustomersMobileCounter3: number;
  maxCustomersReservationTable: number;
  minCustomersReservationTable: number;
  maxCustomersReservationCounter: number;
  minCustomersReservationCounter: number;
  maxCustomersReservationCounter2: number;
  minCustomersReservationCounter2: number;
  maxCustomersReservationCounter3: number;
  minCustomersReservationCounter3: number;
  isAgs: boolean;
  waitingGroup: number;
  localTicketingStatus: string;
  clientVersion: string;
  seatConfig: number;
  pairReservationsAllowed: boolean;
  showCheckinCode: boolean;
  showCheckinCodeDialog: boolean;
  waitShowType: number;
  waitingGroupTable: number;
  waitingGroupCounter: number;
  waitingGroupPair: number;
  region: string;
};

export type StoreQueue = {
  boothQueue: number[];
  counterQueue: number[];
  mixedQueue: number[];
  reservationQueue: number[];
  reservationCounterQueue: number[];
  reservationBoothQueue: number[];
  storeQueue: number[];
  storeCounterQueue: number[];
  storeBoothQueue: number[];
  separateQueue: number;
};

export type SortMethod =
  | "default"
  | "distance"
  | "waitTime"
  | "waitTable"
  | "name-asc"
  | "name-dsc"
  | "openDate";

export type LocationGetter = () => Promise<GeolocationCoordinates>;
