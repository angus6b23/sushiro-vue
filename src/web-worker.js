
var notice = ''
var repeatNotice = ''
onmessage = async (e) =>{
    let message = e.data;
    if (message.cancel){
        clearInterval(reapeatNotice);
    } else {
        let nextTicket = generateInfo(message);
        reapeatNotice = setInterval(function(){generateInfo(message)}, 5000);
    }
}

async function generateInfo(message){
    try{
        let response = await fetch(message.url);
        let fullfilled = await response.json();
        let nextTicket = await fullfilled.storeQueue[0];
        notice = new Notification('壽司郎\n' + message.storeName + '：' + nextTicket + '\n按下通知取消追蹤');
    } catch(e){
        console.error(e);
    }
}

notice.onClick = (e) => {
    console.log(e);
    clearInterval(reapeatNotice);
}
