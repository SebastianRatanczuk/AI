function geoFindMe() {

    const mapLink = document.querySelector('#map-link');
    mapLink.textContent = '';

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        map.setView([latitude, longitude], 13);

        mapLink.textContent = `${convertCords(latitude)}, ${convertCords(longitude)}`;
    }

    function error() {
        mapLink.textContent = 'Nie można pobrać lokalizacji';
    }

    if (!navigator.geolocation) {
        mapLink.textContent = 'Geolokalizacja nie jest wspierana przez twoją przegladarke';
    } else {
        mapLink.textContent = 'Lokalizowanie...';
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function convertCords(dd) {
    let degree = dd | 0;
    let fraction = Math.abs(dd - degree);
    let min = (fraction * 60) | 0;
    let sec = Math.round(fraction * 3600 - min * 60);
    return degree + "\u00B0 " + min + "' " + sec + "\"";
}

var map = L.map('map')
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2ViYXN0aWFucmF0YW5jenVrIiwiYSI6ImNrdnNlbXIxNjEwZHAycHFwdDR0bnV6NzMifQ.lQwF97zdNLW-H7983mA-Ew'
}).addTo(map);


document.querySelector('#find-me').addEventListener('click', geoFindMe);

document.querySelector("#get-image").addEventListener("click", function () {
    leafletImage(map, function (err, canvas) {
        let map = document.body.appendChild(canvas);
        slicePuzzle(canvas);
        map.remove()
    });
});

function slicePuzzle(image) {
    document.querySelector("#puzzleHolder").innerHTML = "";
    let arr = [];
    let goodPuzzle = [];
    let puzzles = [];
    let columns = 4;
    let rows = 4;
    let puzzleSize = columns * rows;
    let puzzleHeight = image.offsetHeight / columns - 4;
    let puzzleWidth = image.offsetWidth / rows - 4;

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            let canvas = document.createElement("canvas");
            canvas.width = puzzleWidth;
            canvas.height = puzzleHeight;
            canvas.getContext('2d').drawImage(image, j * puzzleWidth, i * puzzleHeight, puzzleWidth, puzzleHeight, 0, 0, puzzleHeight, puzzleWidth);
            puzzles.push(canvas);
        }
    }

    for (let i = 0; i < puzzleSize; i++) {
        let element = document.createElement("div");
        element.style.width = puzzleWidth + "px";
        element.style.height = puzzleHeight + "px";
        element.style.backgroundImage = "url('" + puzzles[i].toDataURL() + "')";
        element.style.backgroundColor = "red";
        element.classList.add("puzzle");
        element.setAttribute('id', "drag" + i);
        element.setAttribute('draggable', "true");
        goodPuzzle.push(element);
    }

    while (arr.length < puzzleSize) {
        let rand = Math.floor(Math.random() * puzzleSize);
        if (arr.indexOf(rand) === -1) {
            arr.push(rand);
        }
    }
    document.querySelector("#puzzleHolder").innerHTML = "";
    document.querySelector("#images").innerHTML = ""
    for (let i = 0; i < arr.length; i++) {
        document.querySelector("#puzzleHolder").appendChild(goodPuzzle[arr[i]]);
        let dropField = document.createElement("div");
        dropField.setAttribute("id", "drop" + i);
        dropField.style.backgroundColor = "#eee";
        dropField.classList.add("drag-target");
        document.querySelector("#images").appendChild(dropField);
    }
    startBoard()
}

function startBoard() {
    let puzzles = document.querySelectorAll('.puzzle');
    for (let puzzle of puzzles) {
        puzzle.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text", this.id);
        });
    }

    let targets = document.querySelectorAll(".drag-target");
    for (let target of targets) {
        target.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
        target.addEventListener("drop", function (event) {
            event.preventDefault();
            let data = event.dataTransfer.getData("text");
            let target = event.target;

            if (target.id.includes("drag")) {
                let dataParentNode = document.getElementById(data).parentNode;
                let targetParentNode = document.getElementById(target.id).parentNode;

                dataParentNode.appendChild(document.getElementById(target.id));
                targetParentNode.appendChild(document.getElementById(data));
            } else {
                target.appendChild(document.getElementById(data));
            }
            checkWin();
        }, false);
    }
}

function checkWin() {
    let targets = document.querySelectorAll(".puzzle");
    let flag = true;
    targets.forEach(target => {
        let parentId = target.parentNode.id;
        let targetId = target.id.replace("drag", "");
        if (parentId !== "puzzleHolder") {
            parentId = parentId.replace("drop", "");
            if (parentId !== targetId) {
                flag = false;
            }
        } else {
            flag = false;
        }
    })

    if (flag) {
        showAlert()
    }
}

function showAlert() {
    let alertStyle = document.getElementById("alert").style;
    alertStyle.opacity = "1";
    alertStyle.display = "block";
    setTimeout(function () {
        hideAlert();
    }, 4000);
}

function hideAlert() {
    let alertStyle = document.getElementById("alert").style;
    alertStyle.opacity = "0";
    setTimeout(function () {
        alertStyle.display = "none";
    }, 600);
}
