browser.omnibox.setDefaultSuggestion({
    "description": "Bangs Powered by DuckDuckGo"
});

browser.omnibox.onInputEntered.addListener(
    function(text, disposition){
        var url = `https://www.duckduckgo.com/?q=!${text}`;

        switch (disposition) {
            case "currentTab":
                browser.tabs.update({url});
                break;
            case "newForegroundTab":
                browser.tabs.create({url});
                break;
            case "newBackgroundTab":
                browser.tabs.create({url, active: false});
                break;
        }
    }
);


