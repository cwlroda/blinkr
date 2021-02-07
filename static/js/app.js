function blink(x) {
    x.setAttribute("src", "https://www.dropbox.com/s/mnztn69b6840aex/openeye.png?dl=1");
    
    if (x.className === "left") {
        var elem = document.getElementsByClassName("text1");
        elem[0].style.display = "block";
    } else {
        var elem = document.getElementsByClassName("text2");
        elem[0].style.display = "block";
    }
}

function blinkBack(x) {
    x.setAttribute("src", "https://www.dropbox.com/s/h7wfhp0or0qc8i1/closedeye.png?dl=1");

    if (x.className === "left") {
        var elem = document.getElementsByClassName("text1");
        elem[0].style.display = "none";
    } else {
        var elem = document.getElementsByClassName("text2");
        elem[0].style.display = "none";
    }
}

// Used to toggle the menu on small screens when clicking on the menu button
function myFunction() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else { 
        x.className = x.className.replace(" w3-show", "");
    }
}

