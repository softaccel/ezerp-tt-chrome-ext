// Saves options to chrome.storage
function save_options(event) {
    event.preventDefault();
    var apiUrl = event.target.apiUrl.value;
    var userId = event.target.userId.value;
    chrome.storage.sync.set({
        apiUrl: apiUrl,
        userId: userId
    }, function() {
        // Update status to let user know options were saved.
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
        apiUrl: null,
        userId: null,
    }, function(items) {
        document.getElementById('apiUrl').value = items.apiUrl;
        document.getElementById('userId').value = items.userId;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('optionsform').addEventListener('submit',
    save_options);