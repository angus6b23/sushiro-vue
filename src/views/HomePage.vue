
<template>
	<ion-page>
		<ion-header :translucent="true">
			<ion-toolbar>
				<ion-title>香港壽司郎籌號</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true" ref="content">
			<ion-refresher slot="fixed" @ionRefresh="refreshStores">
				<ion-refresher-content></ion-refresher-content>
			</ion-refresher>
			<section v-if="anyBookmarkedStores" class="ion-margin">
				<ion-text>
					<h3>已標記（自動更新籌號）</h3>
				</ion-text>
				<div class="wrapper">
					<div v-for="store in stores" :key="store.id" :class="{ none: !store.isBookmark }" class="store-cards">
						<div v-if="store.isBookmark" class="card-container">
							<StoreCard :store="store" @toggleBookmark="handleToggleBookmark" />
						</div>
					</div>
				</div>
			</section>
			<section class="ion-margin">
				<ion-text>
					<h3>所有分店</h3>
				</ion-text>
				<div class="wrapper">
					<div v-for="store in stores" :key="store.id" :class="{ none: store.isBookmark }" class="store-cards">
						<div v-if="!store.isBookmark" class="card-container">
							<StoreCard v-if="!store.isBookmark" :store="store" @toggleBookmark="handleToggleBookmark" />
						</div>
					</div>
				</div>
			</section>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {
	IonContent,
	IonHeader,
	IonPage,
	IonText,
	IonRefresher,
	IonRefresherContent,
	IonTitle,
	IonToolbar,
} from '@ionic/vue';
import { ref, onMounted, computed, Ref } from 'vue';
import { getStoreList, getAllQueue } from '@/data/getData';
import StoreCard from '@/components/StoreCard.vue';
import { Store, Queue, ReturnData } from '@/data/classes'

const stores: Ref<Store[]> = ref([]);
const content = ref<any>(null);
const bookmarkIndexes: Set<number> = new Set();
let interval: number | undefined;

onMounted(async () => {
	await refreshStores();
	const allQueue: ReturnData = await getAllQueue(stores.value);
	(allQueue.data as Queue[]).map((queue) => {
		const index: number = stores.value.findIndex((store: { id: any; }) => store.id === queue.storeId);
		stores.value[index].queue = queue.data as number[];
	})
})

async function refreshStores(event?: any): Promise<void> {
	const storeList: Store[] = await getStoreList();
	stores.value = storeList;
	if (event && event.target) {
		event.target.complete()
	}
}

const handleToggleBookmark = (id: number): void => {
	const index: number = stores.value.findIndex((store: { id: number; }) => store.id === id);
	stores.value[index].isBookmark = !stores.value[index].isBookmark;
	if (stores.value[index].isBookmark) {
		bookmarkIndexes.add(index);
	} else {
		bookmarkIndexes.delete(index);
	}
	content.value.$el.scrollToTop(500);
	autoUpdateQueue();
}

const anyBookmarkedStores = computed(() => {
	const checkBookmarked = (element: { isBookmark: any; }) => element.isBookmark;
	return stores.value.some(checkBookmarked);
})

const autoUpdateQueue = (): void => {
	if (interval) {
		clearInterval(interval);
	}
	if (bookmarkIndexes.size > 0) {
		interval = setInterval((): void => {
			bookmarkIndexes.forEach((index: number) => {
				stores.value[index].getQueue();
			})
		}
			, 10000)
	}
}
</script>
<style scoped>
.card-container {
	margin: 1rem 0.5rem;
	min-width: 300px;
	flex-shrink: 0;
}
.store-cards{
	flex-grow: 1;
}
.none {
	display: none;
}

#main-view {
	margin-top: 1rem;
}

@media screen and (min-width: 768px) {
	.wrapper {
		display: flex;
		justify-content: start;
		flex-wrap: wrap;
		flex-direction: row;
	}
}</style>