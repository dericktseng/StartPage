/** loads custom CSS from storage. */
browser.storage.sync.get("css").then(function(css) {
    var isSet = Object.keys(css).length != 0;
    if (isSet) {
        var style = document.createElement("style");
        style.innerText = css["css"];
        document.head.appendChild(style);
    }
}, console.error);