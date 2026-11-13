<template>
  <section class="mt-2">
    <div class="flex justify-between items-start">
      <div>
        <ion-text class="text-md block">籌號自動更新中:</ion-text>
        <ion-skeleton-text
          :animated="true"
          v-if="queue === null"
          class="w-16 h-4"
        ></ion-skeleton-text>
        <ion-text
          class="text-lg"
          color="dark"
          v-else-if="queue.storeQueue.length === 0"
          >暫無籌號</ion-text
        >
        <ion-text class="text-lg" v-else="queue !== null">{{
          queue?.storeQueue.join(", ")
        }}</ion-text>
      </div>
      <ion-button @click="updateQueueNow(id)" data-umami-event="refresh-store"
        ><ion-icon :icon="refresh"></ion-icon>立即更新</ion-button
      >
    </div>
    <ion-progress-bar
      class="absolute bottom-0 left-0"
      :value="queue === null ? 0 : queueTicks / (30 * 5)"
    ></ion-progress-bar>
  </section>
</template>
<script setup lang="ts">
import type { StoreQueue } from "@/lib/types";
import {
  IonButton,
  IonIcon,
  IonProgressBar,
  IonText,
  IonSkeletonText,
} from "@ionic/vue";
import { refresh } from "ionicons/icons";
import { inject, type Ref } from "vue";

const { id } = defineProps<{ id: number }>();
const updateQueueNow =
  inject<(id: number) => Promise<void>>("update-queue-now")!;
const queueTicks = inject<Ref<number>>("queue-ticks")!;
const queue = inject<Ref<StoreQueue | null>>("queue")!;
</script>
