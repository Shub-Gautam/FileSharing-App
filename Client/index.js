const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileinput");
const browseBtn = document.querySelector(".browseBtn");

const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");

const fileURL = document.querySelector("#fileURL");
const sharingcontainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copybtn");

const maxAllowwedSized = 100 * 1024 * 1024;

const emailForm = document.querySelector("#email-form");

const toast = document.querySelector(".toast");

const host = "https://filesharebyshubham.herokuapp.com/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

const resetFileInput = () => {
  fileInput.value = "";
};

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
  console.log("File droped : " + files.length);
  if (files.length) {
    console.log("file added to variable");
    fileInput.files = files;
    uploadFile();
  }
});

fileInput.addEventListener("change", () => {
  uploadFile();
});

copyBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
  showtoast("Link Copied!");
});

browseBtn.addEventListener("click", () => {
  fileInput.click();
});

const uploadFile = () => {
  console.log("file added uploading");
  const file = fileInput.files[0];
  console.log(file);
  console.log("uploadable file length : " + file.length);

  if (fileInput.files.length > 1) {
    resetFileInput();
    showtoast("only upload one file");
    return;
  }

  progressContainer.style.display = "block";

  const formData = new FormData();
  formData.append("myfile", file);

  if (file.size > maxAllowwedSized) {
    showtoast("can't upload more than 100MB ");
    resetFileInput();
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      onUploadSuccess(JSON.parse(xhr.response));
    }
  };

  xhr.upload.onprogress = updateProgress;

  xhr.upload.onerror = () => {
    resetFileInput();
    showtoast(`Error in upload: ${xhr.statusText}`);
  };

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

const onUploadSuccess = ({ file: url }) => {
  resetFileInput();
  emailForm[2].removeAttribute("disabled", "true");
  progressContainer.style.display = "none";
  sharingcontainer.style.display = "block";
  fileURL.value = url;
};

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = fileURL.value;

  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };

  emailForm[2].setAttribute("disabled", "true");

  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({ success }) => {
      if (success) {
        sharingcontainer.style.display = "none";
        showtoast("Email Sent");
      }
    });
});

let toastTimer;

const showtoast = (msg) => {
  toast.innerText = msg;
  toast.style.transform = "translate(-50%,0)";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.transform = "translate(-50%,60px)";
  }, 2000);
};
