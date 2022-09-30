
var notice = '';
var repeatNotice = '';
self.addEventListener('install', function(event) {
    // Perform some task
});

onmessage = async (e) =>{
    let message = e.data;
    if (message.cancel){
        clearInterval(reapeatNotice);
    } else {
        let nextTicket = generateInfo(message);
        reapeatNotice = setInterval(function(){generateInfo(message)}, 30000);
    }
}

async function generateInfo(message){
    try{
        let response = await fetch(message.url);
        let fullfilled = await response.json();
        let nextTicket = await fullfilled.storeQueue[0];
        notice = new Notification('壽司郎', {
            tag: 'sushiro',
            body: message.storeName + '：' + nextTicket
        });
    } catch(e){
        console.error(e);
    }
}

notice.onClick = (e) => {
    console.log(e);
    clearInterval(reapeatNotice);
}
