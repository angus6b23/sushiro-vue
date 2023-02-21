<template>
    <ion-card class="container">
        <div>
            <ion-card-subtitle>
                <!-- Subtitles: Area and badges -->
                <ion-text>{{ store.area }}<br /></ion-text>
                <ion-badge v-if="store.storeStatus == 'OPEN'" class="badges" color="primary">營業中</ion-badge>
                <ion-badge v-else class="badges" color="danger">閉店中</ion-badge>
                <ion-badge v-if="store.netTicketStatus.includes('MANUAL') || store.netTicketStatus.includes('ONLINE')"
                    class="badges" color="primary">派籌中</ion-badge>
                <ion-badge v-else color="warning">停止派籌</ion-badge>
            </ion-card-subtitle>
            <!-- Store name -->
            <ion-card-title> {{ store.name }} </ion-card-title>
            <ion-card-content class="no-padding mt-1">
                <ion-grid class="no-padding">
                    <ion-row>
                        <!-- Left side contents: waiting time and ticket numbers -->
                        <ion-col class="no-padding" size="6">
                            <ion-text>輪侯組數: {{ store.wait }}<br /></ion-text>
                            <ion-text v-if="store.queue.length > 0">店鋪籌號: <br />{{ store.queue.join(', ') }}</ion-text>
                            <ion-text v-else>暫無籌號資訊</ion-text>
                        </ion-col>
                        <!-- Right side contents: button group -->
                        <ion-col class="no-padding flex" size="6">
                            <div class="button-group">
                                <ion-button fill="clear" size="small"
                                    :href="`https://www.google.com/maps/search/?api=1&query=${store.address}`"
                                    target="_blank">
                                    <ion-icon slot="icon-only" :icon="mapOutline"></ion-icon>
                                </ion-button>
                                <ion-button fill="clear" size="small" @click="refreshStoreQueue">
                                    <ion-icon slot="icon-only" :icon="refreshOutline"></ion-icon>
                                </ion-button>
                                <ion-button fill="clear" size="small" v-if="store.isBookmark" @click="toggleBookmark">
                                    <ion-icon slot="icon-only" :icon="bookmark"></ion-icon>
                                </ion-button>
                                <ion-button fill="clear" size="small" v-else @click="toggleBookmark">
                                    <ion-icon slot="icon-only" :icon="bookmarkOutline"></ion-icon>
                                </ion-button>
                            </div>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </ion-card-content>
        </div>
    </ion-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonGrid, IonRow, IonCol, IonBadge, IonText, IonIcon, toastController } from '@ionic/vue';
import { mapOutline, refreshOutline, bookmarkOutline, bookmark, checkmarkCircleOutline } from 'ionicons/icons';

const props = defineProps(['store'])
const emit = defineEmits(['toggleBookmark']);
const store: object = ref(props.store);
let interval;
const refreshStoreQueue = async (): Promise<void> => {
    await props.store.getQueue();
    await presentToast();
}

const toggleBookmark = (): void => {
    emit("toggleBookmark", props.store.id);
}

const presentToast = async (): Promise<void> => {
    const toast = await toastController.create({
        message: '已更新店鋪籌號',
        duration: 1000,
        position: 'bottom',
        icon: checkmarkCircleOutline
    })
    await toast.present()
}
</script>

<style scoped>
.container {
    padding: 1rem;
    height: 11rem;
}

.right {
    display: flex;
    justify-items: end;
    align-items: center;
}

.flex {
    display: flex;
    justify-content: end;
}

.badges {
    margin-right: 0.5rem;
    height: 50%;
}

.no-padding {
    padding: 0px;
}

.mt-1 {
    margin-top: 0.5rem;
}

.button-group {
    display: flex;
    justify-content: end;
    align-items: center;
    align-self: center;
}

.button-group button {
    padding: 0px;
}
</style>