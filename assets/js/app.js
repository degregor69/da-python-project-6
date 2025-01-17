document.addEventListener("DOMContentLoaded", () => {
  getBestMovie();
  const categories = ["Sci-Fi", "Comedy"];
  categories.forEach((category, index) => {
    getFourBestMoviesFromCategory(category).then((movies) => {
      createCategorySection(category, index, "fixed-categories-container"); // Create the category section in the DOM
      displayMoviesInExistingContainer(movies, `category-${index}`);
    });
  });
});

const getBestMovie = async () => {
  const url = "http://localhost:8000/api/v1/titles/?imdb_score_min=9";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const bestMovie = findBestMovie(data.results);
    bestMovie.description = await getMovieDescription(bestMovie);

    displayBestMovie(bestMovie);
  } catch (error) {
    console.error("Error fetching the best movies:", error);
  }
};

const findBestMovie = (movies) => {
  // Reduce to find the movie with the best IMDb score
  return movies.reduce((best, current) => {
    return current.imdb_score > best.imdb_score ? current : best;
  });
};

const displayBestMovie = (movie) => {
  document.getElementById("best-movie-title").textContent = movie.title;
  document.getElementById("best-movie-description").textContent =
    movie.description;
  document.getElementById("best-movie-image").src =
    movie.image_url || "assets/images/default-image.jpg"; // Use default image if not available

  // Update data-url of the best-film-details-button
  const detailsButton = document.getElementById("best-movie-details-button");
  detailsButton.setAttribute("data-url", movie.url);
};

const getMovieDescription = async (movie) => {
  try {
    const response = await fetch(movie.url);
    const data = await response.json();
    return data.description || "Description not available";
  } catch (error) {
    console.error("Error fetching the details of the best movie", error);
  }
};

// Fetch the best movies from a specific category
const getFourBestMoviesFromCategory = async (category) => {
  const url = `http://localhost:8000/api/v1/titles/?genre=${encodeURIComponent(
    category
  )}&sort_by=-imdb_score&page_size=4`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching the best movies from category:", error);
    return [];
  }
};

const initCategoryTitle = (category) => {
  const categoryTitleElement = document.getElementById("first-category-title");
  if (categoryTitleElement) {
    categoryTitleElement.textContent = category;
  }
};

// Function to create the category section dynamically
const createCategorySection = (category, index, containerId) => {
  const container = document.getElementById(containerId);

  const categorySection = document.createElement("div");
  categorySection.classList.add("p-4", "my-6");

  categorySection.innerHTML = `
    <h2 id="category-title-${index}" class="text-2xl font-bold mb-4">${category}</h2>
    <div id="category-${index}" class="grid grid-cols-4 gap-4"></div>
  `;

  container.appendChild(categorySection);
};

// Function to display the fetched movies in the respective container
const displayMoviesInExistingContainer = (movies, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID ${containerId} not found.`);
    return;
  }

  container.innerHTML = ""; // Clear the previous content

  if (Array.isArray(movies) && movies.length > 0) {
    // TODO : faire un not et mettre le else ici à la place
    movies.forEach((movie) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("relative", "group");

      movieElement.innerHTML = `
        <img
          src="${movie.image_url || "assets/images/default-image.jpg"}"
          class="w-full max-h-[300px] object-cover rounded-md shadow"
          alt="${movie.title}"
        />
        <div class="h-[100px] absolute top-1/3 left-0 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold transition">
          <h3 class="text-white text-xl font-semibold mb-2">${movie.title}</h3>
          <button
            class="details-button bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full ml-auto mt-auto mb-2 block"
            data-url="${movie.url}"
          >
            Détails
          </button>
        </div>
      `;
      container.appendChild(movieElement);
    });
  } else {
    container.innerHTML = "<p>Aucun film trouvé pour cette catégorie.</p>";
  }
};
