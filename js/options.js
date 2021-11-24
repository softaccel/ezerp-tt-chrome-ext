// Saves options to chrome.storage
function save_options(event) {
    event.preventDefault();
    var appUrl = event.target.appUrl.value;
    var userId = event.target.userId.value;
    chrome.storage.sync.set({
        appUrl: appUrl,
        userId: userId
    }, function() {
        var status = document.getElementById('alert');
        status.textContent = 'Options saved.';
        status.setAttribute("style","");
        setTimeout(function() {
            status.setAttribute("style","display: none;");
        }, 1500);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        appUrl: null,
        userId: null,
    }, function(items) {
        document.getElementById('appUrl').value = items.appUrl;
        document.getElementById('userId').value = items.userId;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('optionsform').addEventListener('submit',save_options);