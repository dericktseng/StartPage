window.onload = displayClock

/* Displays Clock on Document. */
function displayClock() {
    var timedisplay = document.getElementById("timedisplay");

    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    var timestr = format(h, m, s);
    timedisplay.textContent = timestr;
    
    var t = setTimeout(function() {
        displayClock();
    }, 500);
}

/* formats the time to display. */
function format(hours, minutes, seconds) {
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return `${hours}:${minutes}:${seconds} ${ampm}`;
}
