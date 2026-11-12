<template>
  <div class="flex">
    <ion-searchbar
      v-model="search"
      placeholder="輸入店鋪名稱或地址搜尋"
      data-umami-event="search"
    ></ion-searchbar>
    <ion-button id="open-action-sheet" fill="solid" class="min-w-16"
      >排序</ion-button
    >
  </div>
  <section class="flex justify-between">
    <ion-chip
      class="flex-1 flex justify-center"
      :color="chipColor('hk')"
      @click="toggleFilter('hk')"
      data-umami-event="filter"
      >香港島</ion-chip
    >
    <ion-chip
      class="flex-1 flex justify-center"
      :color="chipColor('kl')"
      @click="toggleFilter('kl')"
      data-umami-event="filter"
      >九龍</ion-chip
    >
    <ion-chip
      class="flex-1 flex justify-center"
      :color="chipColor('nt')"
      @click="toggleFilter('nt')"
      data-umami-event="filter"
      >新界</ion-chip
    >
    <ion-chip
      class="flex-1 flex justify-center"
      :color="chipColor('open')"
      @click="toggleFilter('open')"
      data-umami-event="filter"
      >營業中</ion-chip
    >
  </section>
  <section
    v-if="filteredStores.length > 0"
    class="grid grid-cols-1 gap-4 md:grid-cols-2 mt-2 md:p-4 lg:grid-cols-4"
  >
    <StoreCard v-for="store in filteredStores" :store="store" />
  </section>
  <section
    v-else
    id="no-store-found"
    class="flex items-center justify-center flex-col gap-2"
  >
    <ion-icon :icon="sadOutline" class="h-12 w-12" color="medium"></ion-icon>
    <ion-text color="medium">未找到任何匹配的店鋪</ion-text>
    <ion-button @click="resetFilters()">重設搜尋</ion-button>
  </section>
  <ion-action-sheet
    :translucent="true"
    trigger="open-action-sheet"
    header="排序"
    @didDismiss="actionSheetDismiss($event)"
    :buttons="actionSheetButtons()"
  ></ion-action-sheet>
</template>
<script setup lang="ts">
import StoreCard from "@/components/StoreCard.vue";
import { getDistance } from "@/lib/distance";
import { Toast } from "@/lib/toast";

import type { LocationGetter, SortMethod, StoreInfo } from "@/lib/types";
import {
  IonButton,
  IonChip,
  IonIcon,
  IonSearchbar,
  IonText,
  IonActionSheet,
} from "@ionic/vue";
import { sadOutline } from "ionicons/icons";
import { inject, ref, watch, type Ref } from "vue";

const { value: stores } = inject<Ref<StoreInfo[]>>("stores")!;
const getLocation = inject<LocationGetter>("get-location")!;

const filteredStores = ref<StoreInfo[]>(stores!);
const search = ref("");
const filters = ref<string[]>([]);
const sort = ref<SortMethod>("default");

const chipColor = (value: string) => {
  if (filters.value.includes(value)) {
    return "primary";
  }
  return "";
};

const toggleFilter = (value: string) => {
  if (filters.value.includes(value)) {
    filters.value = filters.value.filter((val) => val !== value);
  } else {
    filters.value = [...filters.value, value];
  }
};

const filterStores = async ({
  searchTerms,
  appliedFilters,
  sort,
}: {
  searchTerms: string;
  appliedFilters: string[];
  sort: SortMethod;
}) => {
  let filtered = [...stores!];
  if (appliedFilters.length > 0) {
    const regionFilter: string[] = [];
    if (appliedFilters.includes("hk")) {
      regionFilter.push("香港島");
    }
    if (appliedFilters.includes("kl")) {
      regionFilter.push("九龍");
    }
    if (appliedFilters.includes("nt")) {
      regionFilter.push("新界");
    }
    if (regionFilter.length > 0) {
      filtered = filtered!.filter((shop) => regionFilter.includes(shop.region));
    }
  }

  if (appliedFilters.includes("open")) {
    filtered = filtered!.filter((store) => store.storeStatus === "OPEN");
  }
  if (searchTerms !== "") {
    filtered = filtered!.filter(
      (store) =>
        store.name.includes(searchTerms) ||
        store.address.includes(searchTerms) ||
        store.nameEn.toLowerCase().includes(searchTerms.toLowerCase()),
    );
  }
  switch (sort) {
    case "default": {
      break;
    }
    case "distance": {
      try {
        const currLocation = await getLocation();
        filtered.sort((a, b) => {
          const aDist = getDistance(
            { lat: currLocation.latitude, long: currLocation.longitude },
            { lat: a.latitude, long: a.longitude },
          );
          const bDist = getDistance(
            { lat: currLocation.latitude, long: currLocation.longitude },
            { lat: b.latitude, long: b.longitude },
          );
          return aDist - bDist;
        });
      } catch (err) {
        Toast.error((err as Error).message);
      }
      break;
    }
    case "waitTime": {
      filtered.sort((a, b) => a.wait - b.wait);
      break;
    }
    case "waitTable": {
      filtered.sort((a, b) => a.waitingGroup - b.waitingGroup);
      break;
    }
    case "name-asc": {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    }
    case "name-dsc": {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    }
    case "openDate": {
      filtered.sort(
        (a, b) =>
          new Date(b.commencementDate).getTime() -
          new Date(a.commencementDate).getTime(),
      );
      break;
    }
    default: {
      console.error("unknown sort method");
    }
  }
  filteredStores.value = filtered;
};

const resetFilters = () => {
  filters.value = [];
  search.value = "";
};

const actionSheetDismiss = (event: CustomEvent) => {
  if (event.detail.data) {
    sort.value = event.detail.data.sort;
    if ((window as any).umami) {
      (window as any).umami.track("sort", { method: event.detail.data.sort });
    }
  }
};
const actionSheetButtons = () => [
  {
    text: "預設",
    data: {
      sort: "default",
    },
    cssClass: sort.value === "default" ? "!text-primary" : "",
  },
  {
    text: "距離（由近至遠）",
    data: {
      sort: "distance",
    },
    cssClass: sort.value === "distance" ? "!text-primary" : "",
  },
  {
    text: "輪侯時間（由短至長）",
    data: {
      sort: "waitTime",
    },
    cssClass: sort.value === "waitTime" ? "!text-primary" : "",
  },
  {
    text: "輪侯組數（由少至多）",
    data: {
      sort: "waitTable",
    },
    cssClass: sort.value === "waitTable" ? "!text-primary" : "",
  },
  {
    text: "名稱（順序）",
    data: {
      sort: "name-asc",
    },
    cssClass: sort.value === "name-asc" ? "!text-primary" : "",
  },
  {
    text: "名稱（反序）",
    data: {
      sort: "name-dsc",
    },
    cssClass: sort.value === "name-dsc" ? "!text-primary" : "",
  },
  {
    text: "開店日期（由新至舊）",
    data: {
      sort: "openDate",
    },
    cssClass: sort.value === "openDate" ? "!text-primary" : "",
  },
];

watch(
  () => ({
    searchTerms: search.value,
    appliedFilters: filters.value,
    sort: sort.value,
  }),
  filterStores,
);
</script>
<style scoped>
#no-store-found {
  height: calc(100% - 100px);
}
</style>
