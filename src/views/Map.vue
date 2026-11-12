<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>壽司郎店鋪地圖</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="w-full h-full" ref="mapContainer"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";

import { Toast } from "@/lib/toast";
import "@maptoolkit/maplibre-logo-control/style.css";
import {
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
} from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { inject, onMounted, useTemplateRef, type Ref } from "vue";
import type { StoreInfo } from "@/lib/types";

const { value: stores } = inject<Ref<StoreInfo[]>>("stores")!;
const mapContainerRef = useTemplateRef("mapContainer");
setWorkerUrl(workerUrl);

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
onMounted(() => {
  try {
    const map = new Map({
      container: mapContainerRef.value!,
      style: isDark
        ? "https://styles.maptoolkit.org/dark.json"
        : "https://styles.maptoolkit.org/light.json",
      center: [114.143326, 22.394694],
      zoom: 10,
      attributionControl: { compact: true },
    });
    map.addControl(
      new GeolocateControl({ positionOptions: { enableHighAccuracy: true } }),
    );
    map.addControl(new NavigationControl(), "top-left");
    stores.forEach((store) => {
      const html = `${store.name}<br/>${store.address}<br />輪侯時間: ${store.wait} 分鐘 / ${store.waitingGroup} 組`;
      const popup = new Popup({ offset: 25 }).setHTML(html);
      new Marker()
        .setLngLat([store.longitude, store.latitude])
        .setPopup(popup)
        .addTo(map);
    });
  } catch (error) {
    console.error(error);
    Toast.error((error as Error).message);
  }
});
</script>
<style>
.maplibregl-popup-content {
  color: black;
}
</style>
