<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/shop-list">
          <ion-icon aria-hidden="true" :icon="list" />
          <ion-label>店鋪列表</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/map">
          <ion-icon aria-hidden="true" :icon="locationOutline" />
          <ion-label>地圖</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { API } from "@/lib/api";
import { Toast } from "@/lib/toast";
import type { StoreInfo } from "@/lib/types";
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  loadingController,
} from "@ionic/vue";
import { list, locationOutline } from "ionicons/icons";
import { provide, ref } from "vue";

const loader = await loadingController.create({
  message: "正在取得店鋪資料",
});
loader.present();

const stores = ref<StoreInfo[]>();
try {
  const res = await API.fetchShopList();
  stores.value = res;
  loader.dismiss();
  provide("stores", stores);
} catch (e) {
  console.error(e);
  Toast.error("取得店鋪資料時發生錯誤，請重新整理頁面");
}

let location = ref<GeolocationCoordinates | null>(null);

const getLocation = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("你的瀏覽器不支持地理位置API"));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        location.value = position.coords;
        resolve(position.coords);
      },
      (error) => {
        switch (error.code) {
          case 1: {
            reject(new Error("你拒絕了定位要求"));
            return;
          }
          case 2: {
            reject(new Error("定位發生錯誤"));
            return;
          }
          case 3: {
            reject(new Error("定位超時"));
            return;
          }
        }
      },
    );
  });
};
provide("location", location);
provide("get-location", getLocation);
</script>
