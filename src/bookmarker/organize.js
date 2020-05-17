/* Initializes the display. */
function organize(cards) {
    var columns = browser.storage.sync.get("cols");
    
    columns.then(function(cols) {
        var isSet = Object.keys(cols).length != 0;
        if (!isSet) {
            var setter = browser.storage.sync.set({"cols": 5});
            organizeDisplay(5, cards);
        } else {
            organizeDisplay(cols['cols'], cards);
        }
    }, console.error);
}

/* Organizes display into mason style. */
function organizeDisplay(cols, cards) {
    var display = document.getElementById("display");
    var bins = [];
    for (let i = 0; i < cols; i++) {
        var bin = document.createElement("div");
        bin.classList.add("bin");
        display.appendChild(bin);
        bins.push(bin);
    }

    for (let i = 0; i < cards.length - cols; i++) {
        var card = cards[i];
        bins[i % cols].appendChild(card);
    }

    var testbin = document.createElement("div");
    testbin.classList.add("bin");
    display.appendChild(testbin);

    var lastcards = [];
    for (let i = cards.length - cols; i < cards.length; i++) {
        var card = cards[i];
        testbin.appendChild(card);
        lastcards.push(card);
    }
    for (let i = 0; i < cols; i++) {
        var bin = minBin(bins);
        bin.appendChild(maxCard(lastcards));
    }

    // makes all bins visible
    display.removeChild(testbin);
    for (let bin of bins) {
        bin.style.visibility = "visible";
    }
}

/* Get the minimum height bin. */
function minBin(bins) {
    var mbin = bins[0];
    for (let i = 1; i < bins.length; i++) {
        if (binHeight(bins[i]) < binHeight(mbin)) {
            mbin = bins[i];
        }
    }
    return mbin;
}

/* Gets the height of given bin. */
function binHeight(bin) {
    var children = bin['children'];
    var total = 0;
    for (let child of children) {
        total += child.clientHeight;
    }
    return total;
}

function maxCard(cards) {
    var mcard = cards[0];
    var index = 0;
    for (let i = 1; i < cards.length; i++) {
        if (cards[i].clientHeight > mcard.clientHeight) {
            mcard = cards[i];
            index = i;
        }
    }
    cards.splice(index, 1);
    return mcard;
}
