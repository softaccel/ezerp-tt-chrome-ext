window.addEventListener('message', function(event) {
    if(typeof event.data.command==="undefined") {
        return;
    }

    switch (event.data.command) {
        case "get":
            chrome.storage.sync.get(event.data.data, (item)=>event.source.postMessage({command:"sync",data:item},"*"));
            break;
        case "set":
            chrome.storage.sync.set(event.data.data);
            break;
    }
});

chrome.storage.sync.get({appUrl:null}, function(item) {
    if(typeof item.appUrl==="undefined" || item.appUrl===null || item.appUrl===""){
        document.getElementById("invalidApiUrl").setAttribute("style","display: block");
        return;
    }
    document.getElementById("ttclient").setAttribute("src",item.appUrl);
});



