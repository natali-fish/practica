let data = [];
let timerId;
let time = 100;
let selectedIndex = 0;
let loadingCount = 5;
function updateTimer() {
  time -= 0.5;
  if (time <= 0) {
    selectImage(selectedIndex + 1);
    time = 100;
  }
  document.querySelector(".progress").style.width = time + "%";

  startTimer();
}
function toggleTimer(event) {
  if (event.target.textContent === "STOP") {
    event.target.textContent = "PLAY";
    stopTimer();
  } else {
    event.target.textContent = "STOP";
    startTimer();
  }
}
function stopTimer() {
  time = 100;
  document.querySelector(".progress").style.width = time + "%";
  clearTimeout(timerId);
}

function startTimer() {
  timerId = setTimeout(updateTimer, 10);
}

function selectImage(index) {
  //функция для определения активной картинки
  selectedIndex = Number(index);
  if (selectedIndex === data.length) {
    loadIamges();
  }
  document.querySelectorAll(".thumb div").forEach((item, i) => {
    if (i === selectedIndex) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });
  document.querySelector(".preview img").src = data[selectedIndex].download_url;
  document.querySelector(".preview img").classList.add("loading");
  document.querySelector(".preview .author").textContent =
    data[selectedIndex].author;
}

function drawImages() {
  //функция для отрисовки картинок
  const images = document.querySelectorAll(".thumb img");
  data.forEach((item, i) => {
    images[i].src = item.download_url;
    images[i].classList.add("loading");
  });
  selectImage(0);
}

function loadIamges() {
  // функция для запроса к серверу
  loadingCount = 5;
  stopTimer();
  const page = Math.floor(Math.random() * (800 / 4));
  const url = "https://picsum.photos/v2/list?page=" + page + "&limit=4";
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      data = json;
      drawImages();
    });
}

function onThumbClick(event) {
  if (event.target.tagName !== "IMG") return;
  stopTimer();
  document.querySelector(".play").textContent = "PLAY";
  selectImage(event.target.dataset.index);
}

function removeLoading(event) {
  loadingCount -= 1;
  if (
    loadingCount === 0 &&
    document.querySelector(".play").textContent === "STOP"
  ) {
    startTimer();
  }
  event.target.classList.remove("loading");
}

function init() {
  loadIamges();
  document.querySelector(".thumb").addEventListener("click", onThumbClick);
  document.querySelector(".new").addEventListener("click", loadIamges);
  document.querySelectorAll("img").forEach((item) => {
    item.onload = removeLoading;
  });
  document.querySelector(".play").addEventListener("click", toggleTimer);
}

window.addEventListener("DOMContentLoaded", init);
