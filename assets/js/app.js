document.addEventListener("DOMContentLoaded", () => {
  initDropdownMenu();
  initModalLogic();
  getBestMovie();

  // Fetch movies for each category and dynamically create sections
  const categories = ["Sci-Fi", "Comedy"];
  categories.forEach((category, index) => {
    getFourBestMoviesFromCategory(category).then((movies) => {
      createCategorySection(category, index); // Create the category section in the DOM
      displayMoviesInExistingContainer(movies, `category-${index}`);
    });
  });
});

const initDropdownMenu = () => {
  // Dropdown menu logic
  const button = document.getElementById("dropdown-button");
  const dropdown = button.nextElementSibling;
  const options = dropdown.querySelectorAll("li");

  // Toggle dropdown
  button.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  // Select and display the options
  options.forEach((option) => {
    option.addEventListener("click", () => {
      button.textContent = option.getAttribute("data-option");

      // Close dropdown after selection
      dropdown.classList.add("hidden");
    });
  });
};

const initModalLogic = () => {
  // Modal logic
  const detailsButton = document.getElementById("details-button");
  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("close-modal");

  // Open modal when the "Details" button is clicked
  detailsButton.addEventListener("click", () => {
    showMovieDetails();
    modal.classList.remove("hidden");
  });

  // Close modal when the "X" button is clicked
  closeModalButton.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Close modal when clicking outside the modal content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
      console.log("Modal closed by clicking outside"); // Debugging log
    }
  });
};

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
  console.log(movie);
  document.getElementById("best-movie-title").textContent = movie.title;
  document.getElementById("best-movie-description").textContent =
    movie.description;
  document.getElementById("best-movie-image").src =
    movie.image_url || "assets/images/default-image.jpg"; // Use default image if not available

  // Update data-url of the best-film-details-button
  const detailsButton = document.getElementById("details-button");
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

const showMovieDetails = async () => {
  const detailsButton = document.getElementById("details-button");

  if (!isValidDetailsButton(detailsButton)) {
    return;
  }

  const movieUrl = detailsButton.getAttribute("data-url");

  try {
    const data = await fetchMovieDetails(movieUrl);
    populateModal(data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
};

// Validate if the details button exists and has the data-url attribute
const isValidDetailsButton = (button) => {
  return button && button.hasAttribute("data-url");
};

// Fetch movie details from the API
const fetchMovieDetails = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }
  return response.json();
};

// Populate the modal with movie details
const populateModal = (data) => {
  setTextContent("modal-title", data.title);
  setTextContent("modal-year", data.year);
  setTextContent("modal-genres", data.genres.join(", "));
  setTextContent("modal-imdb-score", `${data.imdb_score} / 10`);
  setTextContent("modal-directors", data.directors.join(", "));
  setTextContent("modal-actors", data.actors.join(", "));
  setTextContent("modal-description", data.description);
  setModalImage(data.image_url, data.title);
};

// Helper function to set text content of an element
const setTextContent = (elementId, content) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = content;
  }
};

// Update the modal image
const setModalImage = (imageUrl, altText) => {
  const modalImage = document.getElementById("modal-image");
  if (modalImage) {
    modalImage.src = imageUrl || "assets/images/default-image.jpg";
    modalImage.alt = altText || "Default image";
  }
};

// Add an event to the "Details" button
document
  .getElementById("details-button")
  .addEventListener("click", showMovieDetails);

// Code to close the modal
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("modal").classList.add("hidden"); // Hide the modal
});

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
const createCategorySection = (category, index) => {
  const container = document.getElementById("categories-container");

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
