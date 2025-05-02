// PulseFeed: index.js using Currents API + PWA service worker registration

const API_KEY = "FqGkRw_ezT02lMRA9wkzz7mESvSP9BEOXuUuX5Xbi0S2ha7Q";
const BASE_URL = `https://api.currentsapi.services/v1/latest-news?language=en&apiKey=${API_KEY}`;

let container = document.getElementById("container");
let loading = document.querySelector(".loading");
let page = 1;
let observer;

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

// Initial load
window.addEventListener("DOMContentLoaded", () => {
  fetchNews();
});

// Fetch and render news
async function fetchNews() {
  showLoading();

  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();

    data.news.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("post");

      const image = item.image || "https://via.placeholder.com/600x400?text=No+Image";
      const author = item.author || "Unknown";
      const date = new Date(item.published).toLocaleDateString("en-GB");

      card.innerHTML = `
        <img src="${image}" alt="article image">
        <div class="post-content">
          <h2>${item.title}</h2>
          <p class="meta">${date} – ${author}</p>
          <p class="desc" style="display:none">${item.description || "No description available."}</p>
          <a href="${item.url}" target="_blank" class="readmore-btn">Read More</a>
        </div>
      `;

      // Toggle content
      const desc = card.querySelector(".desc");
      const toggleBtn = card.querySelector(".readmore-btn");
      toggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (desc.style.display === "none") {
          desc.style.display = "block";
          toggleBtn.textContent = "Read Less";
        } else {
          desc.style.display = "none";
          toggleBtn.textContent = "Read More";
        }
      });

      container.appendChild(card);
    });

    observeScroll();
  } catch (error) {
    console.error("Failed to fetch news:", error);
  } finally {
    hideLoading();
  }
}

function showLoading() {
  loading.classList.add("show");
}

function hideLoading() {
  loading.classList.remove("show");
}

// Observe scroll to load more
function observeScroll() {
  if (observer) observer.disconnect();
  const lastPost = container.lastElementChild;

  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      fetchNews();
    }
  });

  if (lastPost) observer.observe(lastPost);
}
