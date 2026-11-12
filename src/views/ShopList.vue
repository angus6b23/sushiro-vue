<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="with-segment">
        <ion-title class="mt-2">香港壽司郎店鋪列表</ion-title>
        <ion-segment :value="segment">
          <ion-segment-button value="saved" content-id="saved">
            <ion-label>已儲存的店鋪</ion-label>
          </ion-segment-button>
          <ion-segment-button value="all" content-id="all">
            <ion-label>所有店鋪</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)"
        ><ion-refresher-content></ion-refresher-content
      ></ion-refresher>
      <ion-segment-view>
        <ion-segment-content id="saved">
          <SavedStores />
        </ion-segment-content>
        <ion-segment-content id="all">
          <AllStores />
        </ion-segment-content>
      </ion-segment-view>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { API } from "@/lib/api";
import type { StoreInfo, StoreQueue } from "@/lib/types";
import {
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  type RefresherCustomEvent,
} from "@ionic/vue";
import { inject, onUnmounted, provide, ref, watch, type Ref } from "vue";
import AllStores from "./AllStores.vue";
import SavedStores from "./SavedStores.vue";

const segment = ref<"all" | "saved">("all");
const savedStores = ref<number[]>([]);
const storesRef = inject<Ref<StoreInfo[]>>("stores")!;

const localSavedStores = localStorage.getItem("saved-stores");
if (localSavedStores) {
  const parsed = JSON.parse(localSavedStores) as number[];
  savedStores.value = parsed;
  if (parsed.length > 0) {
    segment.value = "saved";
  }
}
const toggleSaveStore = (id: number) => {
  if (savedStores.value.includes(id)) {
    savedStores.value = savedStores.value.filter((store) => store !== id);
  } else {
    savedStores.value = [id, ...savedStores.value];
  }
  localStorage.setItem("saved-stores", JSON.stringify(savedStores.value));
};

provide("saved-stores", savedStores);
provide("toggle-save-store", toggleSaveStore);

const selectedStoreId = ref<number | null>(null);
const changeSelectedStoreId = (id: number) => {
  queue.value = null;
  selectedStoreId.value = id;
  updateQueueNow();
};
provide("selected-store-id", selectedStoreId);
provide("change-selected-store-id", changeSelectedStoreId);

const queueTicks = ref<number>(30 * 5);
const queue = ref<StoreQueue | null>(null);

const decrementQueueTicks = async () => {
  queueTicks.value--;
};

watch(queueTicks, async () => {
  if (queueTicks.value === 0 && selectedStoreId.value) {
    const res = await API.fetchShopQueue(selectedStoreId.value);
    queue.value = res;
    queueTicks.value = 30 * 5;
  }
});

const updateQueueNow = async () => {
  if (!selectedStoreId.value) return;
  const res = await API.fetchShopQueue(selectedStoreId.value);
  queue.value = res;
  queueTicks.value = 30 * 5;
};

const queueInterval = setInterval(decrementQueueTicks, 200);

const handleRefresh = async (event: RefresherCustomEvent) => {
  const res = await API.fetchShopList();
  storesRef.value = res;
  event.target.complete();
};
onUnmounted(() => {
  clearInterval(queueInterval);
});

provide("update-queue-now", updateQueueNow);
provide("queue-ticks", queueTicks);
provide("queue", queue);
</script>
<style scoped>
.ios ion-toolbar.with-segment {
  --min-height: 70px;
  ion-title {
    height: fit-content;
  }
  ion-segment {
    margin-top: 40px;
  }
}
</style>
