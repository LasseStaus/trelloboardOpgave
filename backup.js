"use strict";

window.addEventListener("DOMContentLoaded", start);

const form = document.querySelector("form");
window.form = form;
const elements = form.elements;
window.elements = elements;

form.setAttribute("novalidate", true);

elements.date.value = 12;

const endpoint = "https://trello-d4aa.restdb.io/rest/trelloboard";
const apiKey = "5e9844ec436377171a0c2462";
form.setAttribute("novalidate", true);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let validForm = true;
  const formElements = form.querySelectorAll("input");
  formElements.forEach((el) => {
    el.classList.remove("invalid");
  });

  /*   const cbs = [...form.querySelectorAll("[name=powers]")];
  const checked = cbs.filter((el) => el.checked);

  if (checked.length === 0) {
    validForm = false;
  } */

  if (form.checkValidity()) {
    console.log("submit ready");
    postCard({
      title: form.elements.title.value,
      description: form.elements.description.value,
      date: form.elements.date.value,
      number: form.elements.number.value,
    });
    form.reset();
    //send to restdb/api
  } else {
    formElements.forEach((el) => {
      if (!el.checkValidity()) {
        el.classList.add("invalid");
      }
    });
  }

  /*   if (form.checkValidity()) {
    console.log("submit ready");
    //send to restdb/api
  } else {
    if (!form.elements.title.checkValidity()) {
      console.log("title is invalid");
      const err = form.elements.title.validity;
      if (err.valueMissing) {
        console.log("please fill in the Title");
      }
      // show error for title
    }
  } */
  console.log("submitted");
});

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
    .then((data) => console.log(data));
  console.log("get");
}
console.log(elements.date.value);

function start() {
  get();
  console.log("start");
  document.querySelector("button.add-new").addEventListener("click", () => {
    const data = {
      title: "opgave" + Math.random(),
      description: "tis",
    };
    post(data);
  });
}

function get() {
  document.querySelector(".container").innerHTML = "";
  fetch(endpoint + "?max=100", {
    method: "get",
    headers: { "Content-Type": "application/json; charset=utf-8", "x-apikey": apiKey, "cache-control": "no-cache" },
  })
    .then((e) => e.json())
    .then(showHeroes);

  console.log("get");
}

function showHeroes(data) {
  console.log(data);
  data.forEach(showHero);
  console.log("SHS");
}

function showHero(hero) {
  console.log(hero);
  console.log("SH");
  const template = document.querySelector(".yas").content;
  const copy = template.cloneNode(true);
  const parent = document.querySelector(".container");
  copy.querySelector("article").dataset.id = hero._id;
  copy.querySelector("h1").textContent = hero.title;
  copy.querySelector("h2 span").textContent = hero.description;
  copy.querySelector("h3").textContent = hero.dob;

  const ul = copy.querySelector("ul");

  /* hero.powers.forEach((power) => {
    const li = document.createElement("li");
    li.textContent = power;

    ul.appendChild(li);
  }); */
  copy.querySelector("button").addEventListener("click", () => deleteIt(hero._id));
  parent.appendChild(copy);
}

function post(data) {
  const postData = JSON.stringify(data);
  //showHero(data);
  fetch(endpoint, {
    method: "post",
    headers: { "Content-Type": "application/json; charset=utf-8", "x-apikey": apiKey, "cache-control": "no-cache" },

    body: postData,
  })
    .then((res) => res.json())
    .then((data) => showHero(data));
  console.log("get");
}

function deleteIt(id) {
  document.querySelector(`article[data-id="${id}"]`).remove();
  fetch(`${endpoint}/${id}`, {
    method: "delete",
    headers: { "Content-Type": "application/json; charset=utf-8", "x-apikey": apiKey, "cache-control": "no-cache" },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}

function put(id) {
  const data = {
    real_name: "Peter",
    alias: "bigmoney" + Math.random(),
    age: "26",
    dob: "1993-07-06",
    powers: ["tis", "guld"],
  };

  let postData = JSON.stringify(data);
  //showHero(data);
  fetch(`${endpoint}/${id}`, {
    method: "put",
    headers: { "Content-Type": "application/json; charset=utf-8", "x-apikey": apiKey, "cache-control": "no-cache" },

    body: postData,
  })
    .then((d) => d.json())
    .then((data) => {
      const copy = document.querySelector(`article[data-id="${id}"]`);

      copy.querySelector("h1").textContent = data.alias;
      copy.querySelector("h2 span").textContent = data.real_name;
      copy.querySelector("h3").textContent = data.dob;

      const ul = copy.querySelector("ul");

      data.powers.forEach((power) => {
        const li = document.createElement("li");
        li.textContent = power;

        ul.appendChild(li);
      });
    });
  console.log("get");
}
