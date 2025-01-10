document.addEventListener("DOMContentLoaded", () => {
  // --- Initialization ---
  initDropdownMenu();
  initModalLogic();
  getBestMovie();
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

  // Check if the button exists and has the data-url attribute
  if (!detailsButton || !detailsButton.hasAttribute("data-url")) {
    return;
  }
  const movieUrl = detailsButton.getAttribute("data-url");

  try {
    const response = await fetch(movieUrl);
    const data = await response.json();

    // Fill all the modal fields with the details
    document.getElementById("modal-title").textContent = data.title;
    document.getElementById("modal-year").textContent = data.year;
    document.getElementById("modal-genres").textContent =
      data.genres.join(", ");
    document.getElementById(
      "modal-imdb-score"
    ).textContent = `${data.imdb_score} / 10`;
    document.getElementById("modal-directors").textContent =
      data.directors.join(", ");
    document.getElementById("modal-actors").textContent =
      data.actors.join(", ");
    document.getElementById("modal-description").textContent = data.description;

    // Update the movie image
    const modalImage = document.getElementById("modal-image");
    modalImage.src = data.image_url || "assets/images/default-image.jpg";
    modalImage.alt = data.title;
  } catch (error) {
    console.error("Error fetching movie details:", error);
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
