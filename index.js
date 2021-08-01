const dropZone = document.querySelector(".drop-zone");
const fileinput = document.querySelector("#fileinput");
const browseBtn = document.querySelector(".browseBtn");

const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");

const fileURL = document.querySelector("#fileURL");
const sharingcontainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copybtn");

const host = "https:/innshare.herokuapp.com/";
const uploadURL = `${host}api/files`;

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
});

dropZone.addEventListener("dragleave", () => {
  if (dropZone.classList.contains("dragged")) {
    dropZone.classList.remove("dragged");
  }
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  if (files.length) {
    fileinput.file = files;
    uploadFile();
  }
});

fileinput.addEventListener("change", () => {
  uploadFile();
});

copyBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
});

browseBtn.addEventListener("click", () => {
  fileinput.click();
});

const uploadFile = () => {
  progressContainer.style.display = "block";
  const file = fileinput.files[0];
  const formData = new FormData();
  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      showLink(JSON.parse(xhr.response));
    }
  };

  xhr.upload.onprogress = updateProgress;

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const updateProgress = (e) => {
  const percentage = Math.round((e.loaded / e.total) * 100);
  console.log(percentage);
  bgProgress.style.width = `${percentage}%`;
  percentDiv.innerText = percentage;
  progressBar.style.transform = `scaleX(${percentage}/100)`;
};

const showLink = ({ file: url }) => {
  progressContainer.style.display = "none";
  sharingcontainer.style.display = "block";
  fileURL.value = url;
};
