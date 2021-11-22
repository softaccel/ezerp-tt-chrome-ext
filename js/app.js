// document.getElementById("ttclient").contentWindow.document.onload = function(){
// };

function getAPIURL() {
    chrome.storage.sync.get({apiUrl:null,userId:null}, function(item) {
        window.setTimeout(()=>document.getElementById("ttclient").contentWindow.postMessage(item, '*'),500);
    });
}
$(document).ready(function () {
    // document.addEventListener('DOMContentLoaded', getAPIURL);
    getAPIURL();
});

window.addEventListener('message', function(event) {
    if(!event.data.command) {
        return;
    }
    if(event.data.command==="saveUser") {
        chrome.storage.sync.set({userId:event.data.data.userId})
    }
});

