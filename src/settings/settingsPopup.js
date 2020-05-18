// launches settings when the browser icon is clicked
browser.browserAction.onClicked.addListener(function(tab){
    browser.runtime.openOptionsPage();
});
