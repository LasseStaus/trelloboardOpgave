"use strict";

window.addEventListener("DOMContentLoaded", start);

function start() {
  setupForm();
  get();
}

const endpoint = "https://trello-d4aa.restdb.io/rest/trelloboard";
const apiKey = "5e9844ec436377171a0c2462";
function setupForm() {
  const form = document.querySelector("form");
  window.form = form;
  const elements = form.elements;
  window.elements = elements;

  form.setAttribute("novalidate", true);

  elements.date.value = 12;

  form.setAttribute("novalidate", true);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let validForm = true;
    const formElements = form.querySelectorAll("input");
    formElements.forEach((el) => {
      el.classList.remove("invalid");
    });

    if (form.checkValidity()) {
      console.log("submit ready");
      if (form.dataset.state === "post") {
        postCard({
          title: form.elements.title.value,
          description: form.elements.description.value,
          date: form.elements.date.value,
          number: form.elements.number.value,
        });
      } else {
        putCard(
          {
            title: form.elements.title.value,
            description: form.elements.description.value,
            date: form.elements.date.value,
            number: form.elements.number.value,
          },
          form.dataset.id
        );
      }

      form.reset();
      //send to restdb/api
    } else {
      formElements.forEach((el) => {
        if (!el.checkValidity()) {
          el.classList.add("invalid");
        }
      });
    }
    console.log("submitted");
  });
}
function postCard(payLoad) {
  console.log("hej");
  const postData = JSON.stringify(payLoad);
  //showHero(data);
  fetch(endpoint, {
    method: "post",
    headers: { "Content-Type": "application/json; charset=utf-8", "x-apikey": apiKey, "cache-control": "no-cache" },
    body: postData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showHero(data);
    });
  console.log("get");
}

function get() {
  fetch(endpoint, {
    method: "get",
    headers: { accept: "application/json", "x-apikey": apiKey, "cache-control": "no-cache" },
  })
    .then((e) => e.json())
    .then((data) => data.forEach(showHero));

  console.log("get");
}
const template = document.querySelector("template").content;

const cardContainer = document.querySelector("#cardlist > .container");

function showHero(card) {
  console.log(card);

  const clone = template.cloneNode(true);

  clone.querySelector("article").dataset.id = card._id;
  clone.querySelector("h2").textContent = card.title;
  clone.querySelector("p").textContent = card.description;
  clone.querySelector("p + p").textContent = card.title;
  clone.querySelector("p + p + p").textContent = card.number;

  clone.querySelector(`[data-action="delete"]`).addEventListener("click", (e) => deleteCard(card._id));
  clone.querySelector(`[data-action="edit"]`).addEventListener("click", (e) => getSingleCard(card._id, setupFormForEdit));

  clone.querySelectorAll(`article, button[data-action="delete"]`).forEach((el) => (el.dataset.id = card._id));

  /* hero.powers.forEach((power) => {
    const li = document.createElement("li");
    li.textContent = power;

    ul.appendChild(li);
  }); */
  //clone.querySelector("button").addEventListener("click", () => deleteIt(card._id));
  cardContainer.appendChild(clone);
}

function getSingleCard(id, callback) {
  console.log(id);

  fetch(`${endpoint}/${id}`, {
    method: "get",
    headers: { "Content-Type": "application/json; charset=utf-8", "x-apikey": apiKey, "cache-control": "no-cache" },
  })
    .then((res) => res.json())
    .then((data) => callback(data));
}

function setupFormForEdit(data) {
  console.log("hi mom");
  const form = document.querySelector("form");

  form.dataset.state = "edit";
  form.dataset.id = data._id;
  form.elements.title.value = data.title;
  form.elements.description.value = data.description;
  form.elements.date.value = data.date;
  form.elements.number.value = data.number;
}

function deleteCard(id) {
  console.log(id);

  fetch(`${endpoint}/${id}`, {
    method: "delete",
    headers: { "Content-Type": "application/json; charset=utf-8", "x-apikey": apiKey, "cache-control": "no-cache" },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
  document.querySelector(`article[data-id="${id}"]`).remove();
}

/* function deleteIt(id) {
  document.querySelector(`article[data-id="${id}"]`).remove();
  fetch(`${endpoint}/${id}`, {
    method: "delete",
    headers: { "Content-Type": "application/json; charset=utf-8", "x-apikey": apiKey, "cache-control": "no-cache" },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
} */

function putCard(payLoad, id) {
  console.log("hej");
  const postData = JSON.stringify(payLoad);
  //showHero(data);
  fetch(`${endpoint}/${id}`, {
    method: "put",
    headers: { "Content-Type": "application/json; charset=utf-8", "x-apikey": apiKey, "cache-control": "no-cache" },
    body: postData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
  console.log("get");
}
