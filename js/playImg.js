var btn = document.getElementById("heartTxt");
btn.style.opacity = 0;
var btnVal = 0;

// Function to hide the button
function hideButton() {
    btn.style.display = "none";
}

// Function to show the button
function showButton() {
    btn.style.display = "block";
}

function showImage() {
    myImage.style.maxWidth = "50%";
    myImage.setAttribute("src", imageArray[imageIndex]);
    myTxt.innerHTML = txtArray[imageIndex];
    imageIndex++;
    if (imageIndex >= len) {
        imageIndex = 0;
        // Show the button after the last image is displayed
        showButton();
    }
}

function play() {
    if (t == 0) {
        myImage.setAttribute("src", "");
        myTxt.innerHTML = "";
        imageIndex = 0;
        clearInterval(showImageInterval);
        // Hide the button when play is initiated
        hideButton();
    }
    flag = 1 - flag;
    document.getElementById("typeDiv").style.opacity = flag;
    document.getElementById("imgTxt").style.opacity = 1 - flag;
    if (t == 0) {
        setInterval(showImage, 3500);
    }
    t++;
}

function preshowImage() {
    document.getElementById("imgTxt").style.opacity = 0;
    myImage.style.maxWidth = "50%";
    myImage.setAttribute("src", imageArray[imageIndex]);
    myTxt.innerHTML = txtArray[imageIndex];
    imageIndex++;
    if (imageIndex >= len) {
        imageIndex = 0;
        // Show the button after the last image is displayed
        showButton();
    }
}

function buttonFadeIn() {
    if (btnVal < 1) {
        btnVal += 0.025;
        btn.style.opacity = btnVal;
    } else {
        clearInterval(buttonInterval);
        if (ok == 3) {
            ok += 1;
        }
    }
}

function event() {
    showImageInterval = setInterval(preshowImage, 100);

    imgInterval = setInterval(function () {
        if (ok == 3) {
            setTimeout(function () {
                buttonInterval = setInterval(buttonFadeIn, 50);
            }, 1500);
            clearInterval(imgInterval);
        }
    }, 50);

    // Initially hide the button
    hideButton();
}

var showImageInterval;
var imgInterval;
var buttonInterval;

event();
