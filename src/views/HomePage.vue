
<template>
	<ion-page>
		<!-- Header -->
		<ion-header :translucent="true">
			<ion-toolbar>
				<ion-title>香港壽司郎籌號</ion-title>
			</ion-toolbar>
		</ion-header>
		<!-- Main Content -->
		<ion-content :fullscreen="true" ref="content">
			<!-- Loading Screen -->
			<ion-loading v-if="initLoading" message="正在獲取店鋪資料<br />請稍侯片刻" />
			<!-- Refresher -->
			<ion-refresher slot="fixed" @ionRefresh="refreshStores">
				<ion-refresher-content></ion-refresher-content>
			</ion-refresher>
			<!-- Section for bookmarked stores -->
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
			<!-- Section for all stores -->
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
	IonLoading,
} from '@ionic/vue';
import { ref, onMounted, computed, Ref } from 'vue';
import { getStoreList, getAllQueue } from '@/data/getData';
import StoreCard from '@/components/StoreCard.vue';
import { Store, Queue } from '@/data/classes'

const stores: Ref<Store[]> = ref([]); //Array for storing all stores
const content = ref<any>(null); //For triggering refresher and bookmark scrolling
const initLoading = ref<boolean>(true); //For showing Loading screen on initial loading

let bookmarkIndexes = new Set<number>(); //For saving Bookmarked stores index
let interval: number | undefined; //For setInterval of auto refresh of bookmarked store queue


onMounted(async () => {
	// Automatically get Stores upon mount
	await refreshStores();
	const allQueue = await getAllQueue(stores.value); //Automatically get all queue after getting store list
	(allQueue.data as Queue[]).map((queue) => { //Populate data into stores array
		const index = stores.value.findIndex((store) => store.id === queue.storeId);
		stores.value[index].queue = queue.data as number[];
	})
	initLoading.value = false
})

async function refreshStores(event?: any): Promise<void> { //Get all stores and set stores
	stores.value = await getStoreList();
	if (event && event.target) { //event = ionrefresher event
		event.target.complete()
		bookmarkIndexes = new Set();//Reset bookmarkList to prevent bugs
	}

}

const handleToggleBookmark = (id: number): void => {
	const index = stores.value.findIndex((store: { id: number; }) => store.id === id);
	stores.value[index].isBookmark = !stores.value[index].isBookmark;
	if (stores.value[index].isBookmark) {
		bookmarkIndexes.add(index);
	} else {
		bookmarkIndexes.delete(index);
	}
	content.value.$el.scrollToTop(500); //Scoll to top after bookmarking
	autoUpdateQueue();
}

const anyBookmarkedStores = computed(() => { //Computed value for showing bookmarked div
	const checkBookmarked = (element: { isBookmark: any; }) => element.isBookmark;
	return stores.value.some(checkBookmarked);
})

const autoUpdateQueue = (): void => {
	if (interval && bookmarkIndexes.size === 0) { //Clear interval if no more bookmarks
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

.store-cards {
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
		justify-content: flex-start;
		flex-wrap: wrap;
		flex-direction: row;
	}
}</style>