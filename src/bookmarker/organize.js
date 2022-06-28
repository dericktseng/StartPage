/** obtains the "optimal" number of columns for comfortable display. */
function calculateOptimalColumns(columns) {
    // minimum allowable width of card in px
    var min_card_width = 300;
    var max_cols = Math.floor(window.innerWidth / min_card_width);
    return Math.min(columns, max_cols);
}

/** Initializes the display. */
function organize(cards) {
    var columns = browser.storage.sync.get("cols");
    
    columns.then(function(cols) {
        var isSet = Object.keys(cols).length != 0;
        var defaultColCount = 5;
        var columns = defaultColCount;
        if (!isSet) {
            browser.storage.sync.set({"cols": defaultColCount});
        } else {
            columns = cols['cols'];
        }

        columns = calculateOptimalColumns(columns);
        organizeDisplay(columns, cards);

    }, console.error);
}

/** Organizes display into mason style. */
function organizeDisplay(cols, cards) {
    var display = document.getElementById("display");

    // clears the display
    display.textContent = "";

    var bins = [];
    for (let i = 0; i < cols; i++) {
        var bin = document.createElement("div");
        bin.classList.add("bin");
        display.appendChild(bin);
        bins.push(bin);
    }

    var testbin = document.createElement("div");
    testbin.classList.add("bin");
    display.appendChild(testbin);

    // allows calculating each card's height.
    for (let card of cards) {
        testbin.appendChild(card);
    }
    
    // distribution algorithm.
    distribute(bins, cards);

    // makes all bins visible
    display.removeChild(testbin);
    for (let bin of bins) {
        bin.style.opacity = 1;
    }
}

/** algorithm to distribute the cards into the bins */
function distribute(bins, cards) {
    var cols = bins.length;
    var row = cards.splice(0, cols);
    var isfirstrow = true;
    while (row.length > 0) {
        if (isfirstrow) {
            for (let i = 0; i < row.length; i++) {
                bins[i].appendChild(row[i]);
            }
            isfirstrow = false;
        } else {
            var cycles = row.length;
            for (let i = 0; i < cycles; i++) {
                minBin(bins).appendChild(maxCard(row));
            }
        }
        row = cards.splice(0, cols);
    }
}

/** Get the minimum height bin. */
function minBin(bins) {
    var mbin = bins[0];
    for (let i = 1; i < bins.length; i++) {
        if (binHeight(bins[i]) < binHeight(mbin)) {
            mbin = bins[i];
        }
    }
    return mbin;
}

/** Gets the height of given bin. */
function binHeight(bin) {
    return bin.clientHeight;
}

/** Gets the card with the max height and takes it out of list. */
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
