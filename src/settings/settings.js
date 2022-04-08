window.onload = displaySettings;

/* displays stuff on settings page. */
function displaySettings(event) {
    displayColumns();
    displayCSS();
}

/** Displays Column Settings. */
function displayColumns() {
    let getColumns = browser.storage.sync.get("cols");
    getColumns.then(function(cols) {
        var isSet = Object.keys(cols).length != 0;
        cols = cols['cols']; 
        var box = document.getElementById("columns");
        var label = document.createElement("label");
        label.htmlFor = "dropdown";
        label.innerText = "Number of Columns: ";
        var dropdown = document.createElement("select");
        dropdown.id = "dropdown";
        dropdown.addEventListener('change', saveColumns);

        // numbers of columns allowed to select (only between 2-8)
        for (var i = 2; i <= 8; i++) {
            var option = document.createElement("option");
            option.value = i;
            option.innerText = i;
            if (isSet) {
                if (i == cols) {
                    option.selected = "selected";
                }
            } else {
                // set 5 as the default number of columns
                if (i == 5) {
                    option.selected = "selected";
                }
            }
            dropdown.appendChild(option);
        }

        box.appendChild(label)
        box.appendChild(dropdown);
    }, console.error);
}

/** Displays CSS in textarea. */
function displayCSS() {
    let getCSS = browser.storage.sync.get("css");
    getCSS.then(function(css) {
        var isSet = Object.keys(css).length != 0;
        css = css["css"];
        var box = document.getElementById("theme");
        var area = document.createElement("textarea");
        area.id = "cssarea";
        area.addEventListener('change', saveCSS);
        
        // allow tabbing in textarea.
        area.onkeydown = function(e) {
            if (e.key == "Tab") {
                e.preventDefault();
                var s = this.selectionStart;
                this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
                this.selectionEnd = s + 1; 
            }
        }

        if (isSet) {
            area.value = css;
        }
        box.appendChild(area);
    });
}

/** saves the custom CSS */
function saveCSS() {
    var area = document.getElementById("cssarea");
    var value = area.value;
    browser.storage.sync.set({"css": value});
}

/** Saves the number of columns. */
function saveColumns(event) {
    var dropdown = document.getElementById("dropdown");
    var value = Number(dropdown.value);
    browser.storage.sync.set({"cols": value});
}
