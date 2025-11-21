// search.js - handles search toggle and future filtering logic

const searchBtn = document.getElementById("searchBtn");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");

// Toggle search bar
searchBtn.addEventListener("click", () => {
  const show = searchContainer.style.display === "block";
  searchContainer.style.display = show ? "none" : "block";
  if (!show) searchInput.focus();
});

// Placeholder for filtering logic
// Uncomment and adapt once you connect to your grid items
// searchInput.addEventListener("input", () => {
//   const query = searchInput.value.toLowerCase();
//   const items = document.querySelectorAll("[data-title]");

//   items.forEach(item => {
//     const title = item.getAttribute("data-title").toLowerCase();
//     item.style.display = title.includes(query) ? "block" : "none";
//   });
// });