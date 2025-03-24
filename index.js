document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault(); 

    let searchQuery = document.querySelector("input[type = 'search']").value.toLowerCase();
    let sections = document.querySelectorAll("section");

    let found = false;

    sections.forEach(section =>{
        if(section.innerText.toLocaleLowerCase().includes(searchQuery)){
            section.scrollIntoView({behavior: "smooth"});
            found = true;
        }
    })

    if(!found){
        alert("No matching content found.")
    }
})

document.addEventListener("DOMContentLoaded", function(){
    const navbarToggler = document.querySelector(".navbar-toggler")
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const content = document.querySelector("body");

    navbarCollapse.addEventListener("shown.bs.collapse", function (){
       content.style.paddingTop = "255px"
    })
    navbarCollapse.addEventListener("hidden.bs.collapse", function (){
        content.style.paddingTop = "60px";
    })

    const learnMoreBtn = document.querySelector(".hero-section a");

    learnMoreBtn.addEventListener("click", function (e){
        e.preventDefault();

        const targetSection = document.querySelector("#learn-more");
        if (targetSection){
            targetSection.scrollIntoView({behavior: "smooth"});
        }
    });
});
  

function fetchForexRate(){
   fetch("https://api.exchangerate-api.com/v4/latest/USD")
.then(response => {
    if(!response.ok){
        throw new Error("Failed to fetch forex data");
    }
    return response.json()
})
.then(data => {
console.log("Full API Response:", data);

const forexList = document.getElementById("forex-rates-list");
forexList.innerHTML = "";

//currencies
const currencies =["KES", "GBP", "USD", "JPY", "AUD"]

currencies.forEach(currency => {
    if (data.rates[currency]){
        const rate = data.rates[currency].toFixed(4);
        const listItem = document.createElement("li");
        listItem.textContent = `USD/${currency}: ${rate}`;
        forexList.appendChild(listItem)
    }
})
})
.catch(error =>{
    console.error("Error:", error);
    document.getElementById("forex-rates-list").innerHTML = "<li>Forex data unavaliable.</li>"
})

}


fetchForexRate();

setInterval(fetchForexRate, 6000);