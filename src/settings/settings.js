window.onload = displaySettings;

/* displays stuff on settings page. */
function displaySettings(event) {
    displayColumns();
}

/* Displays Column Settings. */
function displayColumns() {
    let getColumns = browser.storage.sync.get("cols");
    getColumns.then(function(cols) {
        var isSet = Object.keys(cols).length != 0; 
        var area = document.body;
        var box = document.createElement("div");
        if (isSet) {
            
        }
    }, console.error);
}
