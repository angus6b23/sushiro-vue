/* eslint-disable */
import axios, { Axios } from 'axios'
import { Store, ReturnData } from '@/data/classes'
const corsAnywhereUrl: string = 'https://cors.freehi.workers.dev/?'

export async function getStoreList(): Promise<Store[]>{
    try{
        let storeArray: Store[] = [];
        const response = await axios(`${corsAnywhereUrl}https://sushipass.sushiro.com.hk/api/2.0/info/storelist?latitude=22&longitude=114&numresults=25&region=HK`);
        const responseArray = response.data;
        storeArray = responseArray.map((store: Store) =>{
            const { id, storeStatus, netTicketStatus, wait, name, address, area, latitude, longitude } = store;
            return new Store(id, storeStatus, netTicketStatus, wait, name, address, area, (latitude as number), (longitude as number));
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