document.addEventListener("DOMContentLoaded", async () => {
  try {
    const genres = await fetchAllGenres();
    populateGenresList(genres);
  } catch (error) {
    console.error("Erreur lors du chargement des genres :", error);
  }
});

const toggleDropdown = () => {
  const dropdownMenu = document.getElementById("dropdown-menu");
  const dropdownButton = document.getElementById("dropdown-button");

  const isExpanded = dropdownButton.getAttribute("aria-expanded") === "true";
  dropdownButton.setAttribute("aria-expanded", !isExpanded);
  dropdownMenu.classList.toggle("hidden");
};

const populateGenresList = (genres) => {
  const dropdownList = document.getElementById("dropdown-menu");
  dropdownList.innerHTML = "";

  genres.forEach((genre) => {
    const li = document.createElement("li");
    li.textContent = genre.name;
    li.setAttribute("role", "menuitem");
    li.addEventListener("click", () => getDynamicMovies(genre.name));
    li.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        getDynamicMovies(genre.name);
      }
    });
    dropdownList.appendChild(li);
  });
};

const fetchAllGenres = async () => {
  let allGenres = [];
  let nextPageUrl = "http://localhost:8000/api/v1/genres/?page=1";
  while (nextPageUrl) {
    try {
      const response = await fetch(nextPageUrl);
      const data = await response.json();

      allGenres = [...allGenres, ...data.results];
      nextPageUrl = data.next;
    } catch (error) {
      console.error("Error fetching genres:", error);
      break;
    }
  }
  return allGenres;
};

const getDynamicMovies = async (selectedGenre) => {
  const index = 999;
  const movies = await getMovies(6, selectedGenre, "-imdb_score");
  const dropdownButton = document.getElementById("dropdown-button");

  dropdownButton.innerText = selectedGenre;
  emptyDynamicContainer();
  createCategorySection(selectedGenre, index, "dynamic-category-container");
  displayMoviesInExistingContainer(movies, `category-${index}`);
  closeDropdown();
};

const emptyDynamicContainer = () => {
  document.getElementById("dynamic-category-container").innerHTML = "";
};

const closeDropdownIfClickedOutside = (event) => {
  const dropdownMenu = document.getElementById("dropdown-menu");
  const dropdownButton = document.getElementById("dropdown-button");

  if (!dropdownMenu.contains(event.target) && event.target !== dropdownButton) {
    closeDropdown();
  }
};
document.addEventListener("click", closeDropdownIfClickedOutside);

const closeDropdown = () => {
  const dropdownMenu = document.getElementById("dropdown-menu");
  const dropdownButton = document.getElementById("dropdown-button");

  dropdownMenu.classList.add("hidden");
  dropdownButton.setAttribute("aria-expanded", "false");
};
