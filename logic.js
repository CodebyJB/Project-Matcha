const elements = {};

let sliderImg = [];
let sliderTitle = [];
let lightboxImg = [];

// SLIDER img
let nextIndex = 0;
let lastImg = false;
const increment = () => {
  nextIndex++;
  if (nextIndex >= sliderImg.length) {
    nextIndex = 0;
  }
  sliderImgEl();
};
const decrement = () => {
  nextIndex--;
  if (nextIndex < 0) {
    nextIndex = sliderImg.length - 1;
  }
  sliderImgEl();
};
const sliderImgEl = () => {
  const newImg = document.createElement("img");
  elements.img_cont.append(newImg);
  newImg.src = sliderImg[nextIndex];

  newImg.addEventListener("load", () => {
    if (lastImg) lastImg.remove();
    lastImg = newImg;
  });
};

// Slider title
let nextIndexTitle = 0;
let lastTitle = false;

const incrementTitle = () => {
  nextIndexTitle++;
  if (nextIndexTitle >= sliderTitle.length) {
    nextIndexTitle = 0;
  }
  sliderTitleEl();
};

const sliderTitleEl = () => {
  const newTitle = document.createElement("h3");
  elements.title_cont.append(newTitle);
  newTitle.innerHTML = sliderTitle[nextIndexTitle];

  if (lastTitle) lastTitle.remove();
  lastTitle = newTitle;
};

// LIGHTBOX
const lightbox = () => {
  // open lightbox
  for (const img of lightboxImg) {
    const imgEl = document.createElement("img");
    elements.lightboxImgs.append(imgEl);
    imgEl.src = img;
    imgEl.addEventListener("click", () => {
      imgEl.classList.add("img_modal");
      elements.lightboxContainer.classList.add("modalBackground");
      elements.lightboxIcons.classList.add("icons_show");

      // remove event handler download by cloning element
      const old_element = document.querySelector("p i.download");
      const new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      // download lightbox
      document.querySelector("p i.download").addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = imgEl.src;
        a.download = imgEl.src.split("/").pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      // remove event handler zoom in by cloning element
      const old_zoom_in = document.querySelector(".zoom_in");
      const new_zoom_in = old_zoom_in.cloneNode(true);
      old_zoom_in.parentNode.replaceChild(new_zoom_in, old_zoom_in);

      // img zoom in
      document.querySelector(".zoom_in").addEventListener("click", () => {
        imgEl.classList.toggle("img_zoom_in");
      });

      // remove event handler zoom out by cloning element
      const old_zoom_out = document.querySelector(".zoom_out");
      const new_zoom_out = old_zoom_out.cloneNode(true);
      old_zoom_out.parentNode.replaceChild(new_zoom_out, old_zoom_out);

      // img zoom out
      document.querySelector(".zoom_out").addEventListener("click", () => {
        imgEl.classList.toggle("img_zoom_out");
      });
    });

    // close lightbox
    elements.closeIcon.addEventListener("click", () => {
      imgEl.classList.remove("img_modal");
      imgEl.classList.remove("img_zoom_in");
      imgEl.classList.remove("img_zoom_out");
      elements.lightboxContainer.classList.remove("modalBackground");
      elements.lightboxIcons.classList.remove("icons_show");
    });
  }
};

// contact
const validateNames = (textEl) => {
  let valid = true;
  let whiteList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ- .";
  let characters = textEl.value.split("");
  for (const char of characters) {
    if (!whiteList.includes(char)) valid = false;

    if (valid) {
      textEl.classList.add("valid");
      textEl.classList.remove("invalid");
    } else {
      textEl.classList.add("invalid");
      textEl.classList.remove("valid");
    }
  }
};
const validateNumbers = (num) => {
  let valid = true;
  let whiteList = "0123456789";
  let characters = num.value.split("");
  for (const char of characters) {
    if (!whiteList.includes(char)) valid = false;

    if (valid) {
      num.classList.add("valid");
      num.classList.remove("invalid");
    } else {
      num.classList.add("invalid");
      num.classList.remove("valid");
    }
  }
};
const validateEmails = (email) => {
  let valid = true;
  let whiteList =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ- .@";
  let characters = email.value.split("");
  for (const char of characters) {
    if (!whiteList.includes(char)) valid = false;

    if (valid) {
      email.classList.add("valid");
      email.classList.remove("invalid");
    } else {
      email.classList.add("invalid");
      email.classList.remove("valid");
    }
  }
};
const validateCheck = (checkbox) => {
  if (checkbox.checked) {
    checkbox.classList.add("valid");
    checkbox.classList.remove("invalid");
  } else {
    checkbox.classList.add("invalid");
    checkbox.classList.remove("invalid");
  }
};

const validate = () => {
  for (const el of elements.formElements) {
    if (el.dataset.pattern == "email") validateEmails(el);
    if (el.dataset.pattern == "numbers") validateNumbers(el);
    if (el.dataset.pattern == "names") validateNames(el);
    if (el.dataset.pattern == "checked") validateCheck(el);
  }
  validateAll();
};
const validateAll = () => {
  let allValid = true;
  for (const el of elements.formElements) {
    if (!el.classList.contains("valid")) allValid = false;
  }
  if (allValid) elements.submit.removeAttribute("disabled");
  else elements.submit.setAttribute("disabled", true);
};
const submit = () => {
  elements.submit.addEventListener("click", () => {
    if (!elements.submit.classList.contains("disabled")) {
      alert("Deine Anfrage wird abgeschickt!");
      localStorage.setItem("Vorname", document.querySelector(".vname").value);
      localStorage.setItem("Nachname", document.querySelector(".nname").value);
      localStorage.setItem("Telefon", document.querySelector(".num").value);
      localStorage.setItem("Email", document.querySelector(".email").value);
      localStorage.setItem("Anfrage", document.querySelector(".request").value);
    }
  });
};

// JSON DATA
const processLightbox = (data) => {
  lightboxImg = data;
  lightbox();
};
const processSliderImg = (data) => {
  sliderImg = data;
  sliderImgEl();
  setInterval(increment, 4000);
};
const processSliderTitle = (data) => {
  sliderTitle = data;
  sliderTitleEl();
  setInterval(incrementTitle, 4000);
};
const loadData = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open("get", url);
  xhr.addEventListener("load", () => {
    if (xhr.status == 200) callback(JSON.parse(xhr.responseText));
    else console.log(xhr.statusText);
  });
  xhr.send();
};

const domMapping = () => {
  // slider img
  elements.img_cont = document.querySelector(".img_container");
  elements.increment = document.querySelector(".right");
  elements.decrement = document.querySelector(".left");
  elements.increment.addEventListener("click", increment);
  elements.decrement.addEventListener("click", decrement);

  // slider title
  elements.title_cont = document.querySelector(".letter_container");

  // Lightbox
  elements.lightboxContainer = document.querySelector(".lightbox_container");
  elements.lightboxImgs = document.querySelector(".lightbox_img");
  elements.lightboxIcons = document.querySelector(".icons");
  elements.closeIcon = document.querySelector(".close_x");
  elements.downloadIcon = document.querySelector(".download");

  // contact
  elements.form = document.querySelector("#form");
  elements.checkDsvgo = document.querySelector("#dsvgo");
  elements.formElements = Array.from(
    elements.form.querySelectorAll("input,textarea,select")
  );
  for (const el of elements.formElements) {
    el.addEventListener("input", () => validate(el));
  }
  elements.submit = document.querySelector(".send");
};

const init = () => {
  domMapping();

  loadData("./sliderImg.json", processSliderImg);
  loadData("./sliderTitle.json", processSliderTitle);
  loadData("./lightbox.json", processLightbox);

  validate();
  submit();
};

// INIT
init();
