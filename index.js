document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  let searchQuery = document
    .querySelector("input[type = 'search']")
    .value.toLowerCase();
  let sections = document.querySelectorAll("section");

  let found = false;

  sections.forEach((section) => {
    if (section.innerText.toLocaleLowerCase().includes(searchQuery)) {
      section.scrollIntoView({ behavior: "smooth" });
      found = true;
    }
  });

  if (!found) {
    alert("No matching content found.");
  }
});

// document.addEventListener("DOMContentLoaded", function(){
//     const navbarToggler = document.querySelector(".navbar-toggler")
//     const navbarCollapse = document.querySelector(".navbar-collapse");
//     const content = document.querySelector("body");

//     navbarCollapse.addEventListener("shown.bs.collapse", function (){
//        content.style.paddingTop = "255px"
//     })
//     navbarCollapse.addEventListener("hidden.bs.collapse", function (){
//         content.style.paddingTop = "60px";
//     })

//     const learnMoreBtn = document.querySelector(".hero-section a");

//     learnMoreBtn.addEventListener("click", function (e){
//         e.preventDefault();

//         const targetSection = document.querySelector("#learn-more");
//         if (targetSection){
//             targetSection.scrollIntoView({behavior: "smooth"});
//         }
//     });
// });

function fetchForexRate() {
  fetch("https://api.exchangerate-api.com/v4/latest/USD")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch forex data");
      }
      return response.json();
    })
    .then((data) => {
      

      const forexList = document.getElementById("forex-rates-list");
      forexList.innerHTML = "";

      //currencies
      const currencies = ["KES", "GBP", "USD", "JPY", "AUD"];

      currencies.forEach((currency) => {
        if (data.rates[currency]) {
          const rate = data.rates[currency].toFixed(4);
          const listItem = document.createElement("li");
          listItem.textContent = `USD/${currency}: ${rate}`;
          forexList.appendChild(listItem);
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("forex-rates-list").innerHTML =
        "<li>Forex data unavaliable.</li>";
    });
}

fetchForexRate();

setInterval(fetchForexRate, 6000);

function fetchRedditNews() {
  fetch("https://www.reddit.com/r/stocks/.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      return response.json();
    })
    .then((data) => {
      const newsList = document.getElementById("news-list");
      newsList.innerHTML = "";

      data.data.children.forEach((post) => {
        const newsItem = document.createElement("li");
        const newsLink = document.createElement("a");


        newsLink.textContent = post.data.title;
        newsLink.href= `https:///www.reddit.com${post.data.permalink}`;
        newsLink.target = "_blank";

        newsItem.appendChild(newsLink);
        newsList.appendChild(newsItem);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("news-list").innerHTML =
        "<li>News data unavaliable.</li>";
    });
}
fetchRedditNews();
setInterval(fetchRedditNews, 6000);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("checklist-form");
  const responsesList = document.getElementById("responses-list");
  form.reset();
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted!");
    const formData = new FormData(form);
    const answers = {};

    formData.forEach((value, key) => {
      answers[key] = value;
    });
    console.log("Collected Data:", answers);
    sendToDb(answers).then(fetchResponses)
    
    
    form.reset();
  });
  function sendToDb(data) {
    return fetch("https://json-server-9nao.onrender.com/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) =>console.log(data))
      .catch((error) => console.error("Error:", error));
  }
  function fetchResponses() {
    fetch("https://json-server-9nao.onrender.com/api")
      .then((response) => response.json())
      .then((data) => {
        responsesList.innerHTML = "";
        data.forEach((response, index) => {
          const li = document.createElement("li");
          li.className = "list-group-item";

          // Format response as readable text
          li.innerHTML = `<strong>Response ${index + 1}:</strong><br>`;
          for (const [key, value] of Object.entries(response)) {
            if (key !== "id") {
              li.innerHTML += `<strong>${key}:</strong> ${value} <br>`;
            }
          }

          responsesList.appendChild(li);
        });
      })
      .catch((error) => console.error("Error fetching responses:", error));
  }
  fetchResponses();
});
