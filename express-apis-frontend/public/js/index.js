//console.log("Hello from index.js!");
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("http://localhost:8080/tweets");
        const { tweets } = await res.json();

        const tweetsContainer = document.querySelector("#tweets-container");
        const tweetsHtml = tweets.map(
            ({ message}) => `
            <div class="card">
              <div class="card-body">
                <p class="card-text">${message}</p>
              </div>
            </div>
        `
        );
        tweetsContainer.innerHTML = tweetsHtml.join("");
        if (res.status === 401) {
            return;
        } else {  
        //console.log(tweets);
        res.redirect("/log-in");
        }
    } catch (e) {
        console.error(e);
    }
})