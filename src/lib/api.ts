import { debounce } from "./debounce";
import type { StoreQueue, StoreInfo } from "./types";

export class API {
  private static CORS = import.meta.env.VITE_CORS_URL ?? "";
  private static STORELIST_PARAMS = new URLSearchParams({
    latitude: "22.3193033",
    longitude: "114.16936",
    numresults: "1000",
    region: "HK",
  });
  public static fetchShopList = async (): Promise<StoreInfo[]> => {
    const res = await fetch(
      API.CORS +
        `https://sushipass.sushiro.com.hk/api/2.0/info/storelist?${API.STORELIST_PARAMS}`,
    );
    return await res.json();
  };
  public static fetchShopQueue = async (
    storeid: number,
  ): Promise<StoreQueue> => {
    const queueParams = new URLSearchParams({
      region: "HK",
      storeid: storeid.toString(),
    });
    const res = await fetch(
      API.CORS +
        `https://sushipass.sushiro.com.hk/api/2.0/remote/groupqueues?${queueParams}`,
    );
    return await res.json();
  };
  public static deboubouncedShopQueue = debounce(this.fetchShopQueue, 200);
}
