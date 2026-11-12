<template>
  <ion-text>輪侯時間: {{ timeText() }} | {{ props.group }}組</ion-text>
  <div class="flex gap-1 mb-2 mt-2">
    <ion-progress-bar
      color="success"
      :value="props.time / 45"
    ></ion-progress-bar>
    <ion-progress-bar
      color="warning"
      :value="(props.time - 45) / 45"
    ></ion-progress-bar>
    <ion-progress-bar
      color="danger"
      :value="(props.time - 90) / 90"
    ></ion-progress-bar>
  </div>
</template>
<script setup lang="ts">
import { IonText, IonProgressBar } from "@ionic/vue";
const props = defineProps<{ time: number; group: number }>();

const timeText = () => {
  return props.time > 60
    ? `${Math.floor(props.time / 60)}小時${props.time % 60}分鐘`
    : `${props.time}分鐘`;
};
</script>
