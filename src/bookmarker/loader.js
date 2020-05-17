window.addEventListener('DOMContentLoaded', function(event) {
    var bookmarktree = browser.bookmarks.getTree();
    bookmarktree.then(display, console.error);
});

// name of the folder.
var FOLDERNAME = "StartPage";
var LOCATION = "Bookmarks Toolbar";

/* Gets the correct tree to work with.
 * @param tree - root tree.
 * @return tree to display. */
function getTree(tree) {
    tree = tree[0];  // gets the tree root
    var children = tree['children'];
    for (child of children) {
        if (child['title'] == LOCATION) {
            tree = child;
            children = tree['children'];
            break;
        }
    }
    for (child of children) {
        if (child['title'] == FOLDERNAME) {
            tree = child;
            break;
        }
    }
    return tree;
}


/* Checks whether given startpage folder exists. */
function exists(tree) {
    return (tree['title'] == FOLDERNAME);
}


/* Changes the given tree to an Object. */
function objectOutput(bookmarks) {
    var bookmarkobj = {};
    var titleobj = {};
    objectOutputHelper(bookmarks, bookmarkobj, titleobj);
    return [bookmarkobj, titleobj];
}

/* Helper function for objectOutput. */
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

/* Changes bookmarkObject to html. */
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

/* Forms a card to display. */
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
        var html = `<a href=${bookmark['url']} class="link">${bookmark['title']}</a>`;
        div.innerHTML = html;
        card.appendChild(div);
    }
    return card;
}

/* Displays given bookmarktree onto the screen.
 * @param tree - the root tree.
 */
function display(tree) {
    tree = getTree(tree);
    if (exists(tree)) {
        var area = document.getElementById("display");
        var cards = toCards(tree);
        organize(cards);
    } else {
        browser.bookmarks.create({
            "index": 0,
            "parentId": tree['id'],
            "title": FOLDERNAME,
            "type": "folder"
        });
    }
}
