// Load random Japanese foods on page load
window.addEventListener("DOMContentLoaded", async () => {
  loadDarkMode();
  await loadRandomJapaneseMeals();
});

// Fetch all Japanese meals, then randomly select 6
async function loadRandomJapaneseMeals() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = '<p class="text-muted">Loading...</p>';

  try {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?a=Japanese");
    const data = await res.json();
    const allMeals = data.meals;

    if (!allMeals || allMeals.length === 0) {
      resultsDiv.innerHTML = '<p class="text-danger">No Japanese meals found.</p>';
      return;
    }

    const randomMeals = shuffleArray(allMeals).slice(0, 6);
    resultsDiv.innerHTML = "";

    randomMeals.forEach(meal => {
      const col = document.createElement("div");
      col.className = "col-md-4";

      col.innerHTML = `
        <div class="card h-100 shadow-sm food-card">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${meal.strMeal}</h5>
                <a href="https://www.themealdb.com/meal/${meal.idMeal}" target="_blank" class="mt-auto btn btn-outline-primary">View Recipe</a>
         </div>
        </div>
        `;

      resultsDiv.appendChild(col);
    });

  } catch (error) {
    resultsDiv.innerHTML = '<p class="text-danger">Failed to load meals. Try again later.</p>';
    console.error(error);
  }
}

// Search Japanese food by name (optional)
async function searchJapaneseFood() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!query) {
    resultsDiv.innerHTML = '<p class="text-warning">Please enter a dish name.</p>';
    return;
  }

  resultsDiv.innerHTML = '<p class="text-muted">Searching...</p>';

  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();
    resultsDiv.innerHTML = "";

    const filtered = (data.meals || []).filter(meal => meal.strArea === "Japanese");

    if (filtered.length === 0) {
      resultsDiv.innerHTML = '<p class="text-danger">No Japanese dishes found for that search.</p>';
      return;
    }

    filtered.forEach(meal => {
      const col = document.createElement("div");
      col.className = "col-md-4";

      col.innerHTML = `
        <div class="card h-100 shadow-sm food-card">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${meal.strMeal}</h5>
                <a href="https://www.themealdb.com/meal/${meal.idMeal}" target="_blank" class="mt-auto btn btn-outline-primary">View Recipe</a>
            </div>
        </div>
        `;


      resultsDiv.appendChild(col);
    });

  } catch (error) {
    resultsDiv.innerHTML = '<p class="text-danger">Error fetching data. Try again later.</p>';
    console.error(error);
  }
}

// Shuffle helper
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Clear results
function clearResults() {
  document.getElementById("results").innerHTML = "";
  document.getElementById("searchInput").value = "";
}

// Toggle dark mode
function toggleDarkMode() {
  const body = document.getElementById("body");
  const isDark = body.classList.toggle("dark-mode");
  localStorage.setItem("japanfood-dark", isDark ? "true" : "false");
}

// Load saved theme
function loadDarkMode() {
  const savedTheme = localStorage.getItem("japanfood-dark");
  if (savedTheme === "true") {
    document.getElementById("body").classList.add("dark-mode");
  }
}
