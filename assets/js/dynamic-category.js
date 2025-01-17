document.addEventListener("DOMContentLoaded", async () => {
  try {
    const genres = await fetchAllGenres();
    populateGenresList(genres);
  } catch (error) {
    console.error("Erreur lors du chargement des genres :", error);
  }
});

const toggleDropdown = () => {
  displayList();
};

const populateGenresList = (genres) => {
  const dropdownList = document.getElementById("dropdown-list");
  dropdownList.innerHTML = "";

  genres.forEach((genre) => {
    const li = document.createElement("li");
    li.textContent = genre.name;
    li.setAttribute("onclick", `getDynamicMovies('${genre.name}')`);
    dropdownList.appendChild(li);
  });
};

const displayList = () => {
  const dropdownMenu = document.getElementById("dropdown-menu");
  dropdownMenu.classList.toggle("hidden");
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
  const movies = await getFourBestMoviesFromCategory(selectedGenre);
  emptyDyanmicContainer();
  createCategorySection(selectedGenre, index, "dynamic-category-container");
  displayMoviesInExistingContainer(movies, `category-${index}`);
  closeDropdown();
};

const emptyDyanmicContainer = () => {
  const dynamicCategoryContainer = document.getElementById(
    "dynamic-category-container"
  );
  dynamicCategoryContainer.innerHTML = "";
};

const selectGenre = () => {
  const dropdownList = document.getElementById("dropdown-list");
  dropdownList.addEventListener("click", (e) => {
    const clickedItem = e.target;
    return clickedItem.textContent;
  });
};

// Close dropdown functions
const closeDropdownIfClickedOutside = (event) => {
  const dropdownMenu = document.getElementById("dropdown-menu");
  const dropdownButton = document.getElementById("dropdown-button");

  if (!dropdownMenu.contains(event.target) && event.target !== dropdownButton) {
  }
};
document.addEventListener("click", closeDropdownIfClickedOutside);

const closeDropdown = () => {
  const dropdownMenu = document.getElementById("dropdown-menu");
  dropdownMenu.classList.add("hidden");
};
