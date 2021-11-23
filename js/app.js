// document.getElementById("ttclient").contentWindow.document.onload = function(){
// };

function getAPIURL() {
    chrome.storage.sync.get({apiUrl:null,userId:null}, function(item) {
        window.setTimeout(()=>document.getElementById("ttclient").contentWindow.postMessage({command:"sync",data:item}, '*'),500);
    });
}
$(document).ready(function () {
    // document.addEventListener('DOMContentLoaded', getAPIURL);
    // getAPIURL();
});

window.addEventListener('message', function(event) {
    if(!event.data.command) {
        return;
    }
    switch (event.data.command) {
        case "get":
            chrome.storage.sync.get(event.data.data,function (item) {
                event.source.postMessage({command:"sync",data:item},"*");
            });
            break;
        case "set":
            chrome.storage.sync.set(event.data.data);
            break;
    }
});

