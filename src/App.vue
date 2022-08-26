<script setup>
import { ref, computed, reactive } from 'vue'
const corsAnywhere = 'https://cors.freehi.ga/'
let fetchOptions = {
    method: 'GET',
    headers: {
        'Origin': 'https://sushipass.sushiro.com.hk/'
    }
}
const storeList = ref({});
const updateTime = ref('');
const loadingFail = ref(false);
const loading = ref(false);
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
        let storeResponse = await fetch(corsAnywhere + 'https://sushipass.sushiro.com.hk/api/2.0/remote/groupqueues?region=HK&storeid=' + storeList.value[i].id, fetchOptions);
        let storeStatus = await storeResponse.json();
        storeList.value[i].storeQueue = storeStatus.storeQueue;
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
    }
}
</script>

<template>
    <h1>壽司郎籌號</h1>
    <p>更新時間：{{ updateTime }}</p>
    <button v-if="!loadingFail" :disabled="loading" @click="fetchStoreList()">
        <span v-if="loading">更新中</span>
        <span v-else>更新</span>
    </button>
    <div v-if="loadingFail">
        <p>載入失敗</p>
        <button @click="fetchStoreList()">重新載入</button>
    </div>
    <p v-else-if="!storeList.length">Loading</p>
    <div v-else>
        <div id="table-wrapper">
            <table>
                <tr>
                    <th>店鋪</th>
                    <th>狀態</th>
                    <th>派籌狀態</th>
                    <th>輪侯組數</th>
                    <th>下一張籌號</th>
                    <th>下兩張籌號</th>
                    <th>下三張籌號</th>
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
    width: 80%;
}
th{
    background-color: #515151;
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
