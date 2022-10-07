<script setup>
import { ref, computed, reactive } from 'vue';
document.title = 'Sushiro - vue';
const corsAnywhere = 'https://cors.freehi.workers.dev/?'
let fetchOptions = {
    method: 'GET',
    headers: {
        'Origin': 'https://sushipass.sushiro.com.hk/'
    }
}
var notificationWorker = new Worker('./src/web-worker.js');
const storeList = ref({});
const updateTime = ref('');
const loadingFail = ref(false);
const loading = ref(false);
const notificationStoreId = ref('');
const notificationOn = ref(false);
const notificationAllowed = ref(false);
const noticationRunning = ref(false);
async function fetchStoreList(){
    loadingFail.value = false;
    loading.value = true;
    try{
        const storeListResponse = await fetch(corsAnywhere + 'https://sushipass.sushiro.com.hk/api/2.0/info/storelist?latitude=22&longitude=114&numresults=25&region=HK', fetchOptions);
        if (storeListResponse.ok){
            storeList.value = await storeListResponse.json();
            fetchStoresDetails();
        } else {
            loadingFail.value = true;
        }
    } catch {
        loadingFail.value = true;
    }
}

fetchStoreList()

async function fetchStoresDetails(){
    let date = new Date;
    let minute = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
    updateTime.value = date.getHours() + ':' + minute ;
    for(let i=0; i<storeList.value.length; i++){
        try{
            let storeResponse = await fetch(corsAnywhere + 'https://sushipass.sushiro.com.hk/api/2.0/remote/groupqueues?region=HK&storeid=' + storeList.value[i].id, fetchOptions);
            let storeStatus = await storeResponse.json();
            storeList.value[i].storeQueue = storeStatus.storeQueue;
        } catch(err){}
    }
    loading.value = false;
}
function convertStatus(string){
    return (string === 'OPEN') ? '營業中' : '閉店中';
}
function convertTicket(string){
    switch(string){
        case 'OFFLINE_MANUAL': return '派籌中';
        case 'OFFLINE_CLOSED': return '停止派籌';
        default: return string;
    }
}
 async function addNotification(){
    if (notificationStoreId.value == '') {
    } else {
        notificationOn.value = true;
        let selected_store = storeList.value.filter(obj => obj.id == notificationStoreId.value);
        let worker_message = {
            storeName: selected_store[0].name,
            url: corsAnywhere + 'https://sushipass.sushiro.com.hk/api/2.0/remote/groupqueues?region=HK&storeid=' + selected_store[0].id,
            cancel: false
        }
        if (!("Notification" in window)) {
            // Check if the browser supports notifications
            alert("此瀏覽器不支援通知");
        } else if (Notification.permission === "granted") {
            // Check whether notification permissions have already been granted;
            // if so, create a notification
            notificationAllowed.value = true;
            notificationWorker.postMessage(worker_message);
            // …
        } else if (Notification.permission !== "denied") {
            // We need to ask the user for permission
            Notification.requestPermission().then((permission) => {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    notificationAllowed.value = true;
                    notificationWorker.postMessage(worker_message);
                    // …
                }
            });
        }

        // At last, if the user has denied notifications, and you
        // want to be respectful there is no need to bother them anymore.
    }
}
function clearNotification(){
    notificationWorker.postMessage({cancel: true});
    notificationOn.value = false;
}

</script>

<template>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico">
        <title>Sushiro queue</title>
    </head>
    <h1>壽司郎籌號</h1>
    <p>更新時間：{{ updateTime }}</p>
    <button v-if="!loadingFail" :disabled="loading" @click="fetchStoreList()">
        <span v-if="loading">更新中</span>
        <span v-else>更新</span>
    </button>
    <div v-if="!loading && !notificationOn" style="margin-top: 10px; margin-bottom: 10px">
        <select id="stores-select" v-model="notificationStoreId">
            <option value="">請選擇分店</option>
            <option v-for="store in storeList" :value="store.id">{{ store.name }}</option>
        </select>
        <button @click="addNotification();" style="margin-left: 5px;">新增背景提示</button>
    </div>
    <div v-if="notificationOn && !notificationAllowed">請允許通知以接收更新，開啟通知後可以縮少或退出瀏覽器，但請不要關閉分頁。</div>
    <button v-if="notificationOn && notificationAllowed" @click="clearNotification()">取消追蹤</button>
    <div v-if="loadingFail">
        <p>載入失敗</p>
        <button @click="fetchStoreList()">重新載入</button>
    </div>
    <p v-else-if="!storeList.length">Loading</p>
    <div v-else>
        <div id="table-wrapper">
            <table>
                <tr>
                    <th style="width: 15%">店鋪</th>
                    <th style="width: 15%">狀態</th>
                    <th style="width: 15%">派籌狀態</th>
                    <th style="width: 13.75%">輪侯組數</th>
                    <th style="width: 13.75%">下一張籌號</th>
                    <th style="width: 13.75%">下兩張籌號</th>
                    <th style="width: 13.75%">下三張籌號</th>
                </tr>
                <tr v-for="store in storeList">
                    <td>{{ store.name }}</td>
                    <td>{{ convertStatus(store.storeStatus) }}</td>
                    <td>{{ convertTicket(store.netTicketStatus) }}</td>
                    <td>{{ store.wait }}</td>
                    <td>
                        <span v-if="!store.storeQueue">Loading</span>
                        <span v-else-if="store.storeQueue.length == 0">N/A</span>
                        <span v-else>{{ store.storeQueue[0] }}</span>
                    </td>
                    <td>
                        <span v-if="!store.storeQueue">Loading</span>
                        <span v-else-if="store.storeQueue.length == 0">N/A</span>
                        <span v-else>{{ store.storeQueue[1] }}</span>
                    </td>
                    <td>
                        <span v-if="!store.storeQueue">Loading</span>
                        <span v-else-if="store.storeQueue.length == 0">N/A</span>
                        <span v-else>{{ store.storeQueue[2] }} </span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<style>
body {
    background-color: #2d2d2d;
    color: #cccccc;
    text-align: center;
}
#table-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
}
table{
    width: 100%;
    font-size: 1rem;
}
th{
    background-color: #515151;
}
td{
    height: 80px;
}
button{
    min-width: 100px;
    background-color: #2d2d2d;
    color: #cccccc;
    text-decoration: none;
    border: 2px solid #4d5057;
    border-radius: 10px;
    transition: 0.2s;
}
button:hover{
    background-color: #4d5057;
    transition: 0.2s;
}
button:active{
    background-color: #4d5057;
    transition: 0.2s;
}
</style>
