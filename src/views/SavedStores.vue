<template>
  <section
    v-if="filteredStores().length > 0"
    class="grid grid-cols-1 gap-4 md:grid-cols-2 mt-2 md:p-4 lg:grid-cols-4"
  >
    <StoreCard v-for="store in filteredStores()" :store="store" />
  </section>
  <section
    v-else
    class="h-full w-full flex flex-col items-center justify-center"
  >
    <ion-icon :icon="save" class="w-12 h-12 mb-4" color="medium"></ion-icon>
    <ion-text color="medium">你可以儲存常用的分店在此</ion-text>
    <ion-text class="flex items-center" color="medium">
      找到店鋪後並按下
      <ion-button class="flex items-center flex-1" size="small" fill="clear">
        <ion-icon slot="start" :icon="bookmarkOutline"></ion-icon>
        儲存店鋪
      </ion-button>
      後即可
    </ion-text>
  </section>
</template>
<script setup lang="ts">
import StoreCard from "@/components/StoreCard.vue";
import type { StoreInfo } from "@/lib/types";
import { IonButton, IonIcon, IonText } from "@ionic/vue";
import { bookmarkOutline, save } from "ionicons/icons";
import { inject, type Ref } from "vue";

const savedStores = inject<Ref<number[]>>("saved-stores")!;
const { value: stores } = inject<Ref<StoreInfo[]>>("stores")!;

const filteredStores = () => {
  return savedStores.value
    .map((id) => stores.find((store) => store.id === id))
    .filter((store) => store !== undefined);
};
</script>
