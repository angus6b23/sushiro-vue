import axios from 'axios';
const corsAnywhereUrl = 'https://cors.freehi.workers.dev/?'

export interface ReturnData {
    status: string,
    data?: unknown | unknown[]
}

export interface ResponseStore {
    id: number,
    storeStatus: string,
    netTicketStatus: string,
    name: string,
    address: string,
    area: string,
    latitude: number,
    longitude: number,
    wait: number
    queue: number[],
}
export class Store {
    id: number;
    storeStatus: string;
    netTicketStatus: string;
    name: string;
    address: string;
    area: string;
    location: number[];
    wait: number;
    queue: number[];
    isBookmark: boolean;
    latitude?: number;
    longitude?: number;
    constructor(id: number, storeStatus: string, netTicketStatus: string, wait: number, name: string, address: string, area: string, latitude: number, longitude: number) {
        this.id = id;
        this.storeStatus = storeStatus;
        this.netTicketStatus = netTicketStatus;
        this.name = name;
        this.address = address;
        this.area = area;
        this.location = [latitude, longitude];
        this.wait = wait;
        this.queue = [];
        this.isBookmark = false;
    }
    async getQueue(): Promise<void> {
        try {
            const response = await axios(`${corsAnywhereUrl}https://sushipass.sushiro.com.hk/api/2.0/remote/groupqueues?region=HK&storeid=${this.id}`);
            this.queue = response.data.storeQueue
        } catch (err) {
            console.error(err)
        }
    }
}

export interface Queue{
    storeId: number,
    data: (string | number)[]
}