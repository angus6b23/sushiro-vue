<template>
  <ion-card class="my-0 md:m-0 md:flex md:flex-col md:justify-between">
    <ion-card-header>
      <ion-card-title>
        <div class="flex justify-between items-center">
          {{ store.name }}
          <ion-badge class="leading-[16px]" :color="storeStatus().color">
            {{ storeStatus().text }}
          </ion-badge>
        </div>
      </ion-card-title>
      <ion-card-subtitle
        >{{ store.area }} | {{ store.address }}</ion-card-subtitle
      >
    </ion-card-header>

    <ion-card-content>
      <div class="flex gap-1 items-center -mt-4 mb-2" v-if="location !== null">
        <ion-icon :icon="navigate" size="16"></ion-icon>
        <span>{{ distanceText() }}</span>
      </div>
      <Busyness
        v-if="store.storeStatus === 'OPEN'"
        :time="store.wait"
        :group="store.waitingGroup"
      />
      <div class="flex gap-2 flex-wrap justify-around">
        <ion-button
          class="flex items-center flex-1"
          size="small"
          fill="clear"
          data-umami-event="save-store"
          @click="toggleSaveStore(props.store.id)"
        >
          <ion-icon slot="start" :icon="storeSave().icon"></ion-icon>
          {{ storeSave().text }}
        </ion-button>
        <ion-button
          :href="storeMapLink()"
          class="flex items-center flex-1"
          size="small"
          fill="clear"
          target="_blank"
          data-umami-event="open-map"
        >
          <ion-icon slot="start" :icon="locationOutline"></ion-icon>
          開啟地圖
        </ion-button>
      </div>
      <ion-button
        class="w-full"
        fill="solid"
        v-if="selectedStoreId !== props.store.id"
        @click="changeSelectedStoreId(props.store.id)"
      >
        <ion-icon slot="start" :icon="ticket"></ion-icon>
        查詢叫號
      </ion-button>
      <TicketCall v-else :id="props.store.id"></TicketCall>
    </ion-card-content>
  </ion-card>
</template>
<script setup lang="ts">
import type { StoreInfo } from "@/lib/types";
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from "@ionic/vue";
import {
  bookmark,
  bookmarkOutline,
  locationOutline,
  ticket,
  navigate,
} from "ionicons/icons";
import { inject, type Ref } from "vue";
import TicketCall from "./TicketCall.vue";
import { getDistance } from "@/lib/distance";
import Busyness from "./Busyness.vue";

const props = defineProps<{ store: StoreInfo }>();
const savedStores = inject<Ref<number[]>>("saved-stores")!;
const toggleSaveStore = inject<(id: number) => void>("toggle-save-store")!;
const location = inject<Ref<GeolocationCoordinates | null>>("location")!;
const selectedStoreId = inject<number | null>("selected-store-id")!;
const changeSelectedStoreId = inject<(id: number) => void>(
  "change-selected-store-id",
)!;

const storeStatus = () => {
  return props.store.storeStatus === "CLOSED"
    ? { color: "danger", text: "閉店中" }
    : { text: "營業中", color: "primary" };
};
const storeSave = () => {
  return savedStores.value.includes(props.store.id)
    ? { icon: bookmark, text: "已儲存" }
    : { icon: bookmarkOutline, text: "儲存店鋪" };
};
const storeMapLink = () => {
  return `https://www.google.com/maps/search/?api=1&query=${props.store.address}`;
};
const distanceText = () => {
  if (location.value !== null) {
    const dist = getDistance(
      { lat: location.value.latitude, long: location.value.longitude },
      { lat: props.store.latitude, long: props.store.longitude },
    );
    return dist > 1 ? `${dist}公里` : `${dist * 1000}米`;
  }
};
</script>

<style scope>
.ios ion-badge {
  height: fit-content;
}
.mt-auto {
  margin-top: auto;
}
</style>
