/* eslint-disable */
import axios, { Axios } from 'axios'
const corsAnywhereUrl: string = 'https://cors.freehi.workers.dev/?'
interface ResponseStore{
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
interface ReturnData{
    status: string,
    data?: unknown | unknown[]
}
class Store {
    id: number;
    storeStatus: string;
    netTicketStatus: string;
    name: string;
    address: string;
    area: string;
    location: number[];
    wait: number;
    queue: number[];
    isBookmark: boolean
    constructor(id: number, storeStatus: string, netTicketStatus: string, wait: number, name: string, address: string, area: string, latitude: number, longitude: number){
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
    async getQueue(): Promise<void>{
        try{
            const response = await axios(`${corsAnywhereUrl}https://sushipass.sushiro.com.hk/api/2.0/remote/groupqueues?region=HK&storeid=${this.id}`);
            this.queue = response.data.storeQueue
        } catch(err){
            console.error(err)
        }
    }
}
export async function getStoreList(): Promise<Store[]>{
    try{
        let storeArray: Store[] = [];
        const response = await axios(`${corsAnywhereUrl}https://sushipass.sushiro.com.hk/api/2.0/info/storelist?latitude=22&longitude=114&numresults=25&region=HK`);
        const responseArray = response.data;
        storeArray = responseArray.map((store: ResponseStore) =>{
            const { id, storeStatus, netTicketStatus, wait, name, address, area, latitude, longitude } = store;
            return new Store(id, storeStatus, netTicketStatus, wait, name, address, area, latitude, longitude);
        })
        return storeArray;
    } catch(err){
        console.error(err);
        return [];
    }
}

export async function getAllQueue(storeArray: Store[]): Promise<ReturnData>{
    const urlList: string[] = storeArray.map((store: Store) => {
        return `${corsAnywhereUrl}https://sushipass.sushiro.com.hk/api/2.0/remote/groupqueues?region=HK&storeid=${store.id}`
    });
    const requests: unknown[] = urlList.map(url => axios.get(url));
    const responses: unknown[] = await axios.all(requests);
    const data: object[] = responses.map((response: any) => {
        const storeIdRegex = /storeid\=\d+$/;
        const storeId = parseInt(response.request.responseURL.match(storeIdRegex)[0].replace('storeid=', ''))
        return{
            storeId: storeId,
            data: response.data.storeQueue
        }
    })
    const returnData: ReturnData = {
        status: 'success',
        data: data
    }
    return returnData
}