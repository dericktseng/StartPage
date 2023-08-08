// load on startup.
window.addEventListener('DOMContentLoaded', function(event) {
    display_bookmarks();
});

function display_bookmarks() {
    var bookmarktree = browser.bookmarks.getTree();
    bookmarktree.then(display, console.error);
}

/** Changes the given tree to an Object. */
function objectOutput(bookmarks) {
    var bookmarkobj = {};
    var titleobj = {};
    objectOutputHelper(bookmarks, bookmarkobj, titleobj);
    return [bookmarkobj, titleobj];
}

/** Helper function for objectOutput. */
function objectOutputHelper(bookmarks, bookmarkobj, titleobj) {
    if (bookmarks['type'] == "bookmark") {
        var key = bookmarks['parentId'];
        bookmarkobj[key].push(bookmarks);
    } else {
        var key = bookmarks['id'];
        bookmarkobj[key] = [];
        titleobj[key] = bookmarks['title'];
        for (child of bookmarks['children']) {
            objectOutputHelper(child, bookmarkobj, titleobj);
        }
    }
}

/** Changes bookmarkObject to html. */
function toCards(tree) {
    var obj = objectOutput(tree);
    var foldernames = obj[1];
    var bookmarks = obj[0];
    var cards = [];
    for (property in bookmarks) {
        if (bookmarks[property].length != 0) {
            cards.push(domCard(foldernames[property], bookmarks[property]));
        }
    }
    return cards;
}

/** Forms a card to display. */
function domCard(title, bookmarks) {
    var card = document.createElement("div");
    card.classList.add("card");
    var cardtitle = document.createElement("div");
    cardtitle.classList.add("title");
    cardtitle.textContent = title;
    card.appendChild(cardtitle);

    for (bookmark of bookmarks) {
        var div = document.createElement("div");
        div.classList.add("bookmark");
        var link = document.createElement("a");
        link.textContent = bookmark['title'];
        link.classList.add("link");
        link.href = bookmark['url'];
        div.appendChild(link);
        card.appendChild(div);
    }
    return card;
}

/**
 * Displays given bookmarktree onto the screen.
 * @param treeroot - the root tree.
 */
function display(treeroot) {
    // name of the folder to look for bookmarks.
    var FOLDERNAME = "StartPage";
    var LOCATION = "Bookmarks Toolbar";

    let bmarktoolbar = treeroot[0].children.find((elem) => elem['title'] == LOCATION);
    let folder = bmarktoolbar.children.find((elem) => elem['title'] == FOLDERNAME);
    if (folder != undefined) {
        var cards = toCards(folder);
        organize(cards);
    } else {
        browser.bookmarks.create({
            "index": 0,
            "parentId": bmarktoolbar['id'],
            "title": FOLDERNAME,
            "type": "folder"
        });
    }
}
