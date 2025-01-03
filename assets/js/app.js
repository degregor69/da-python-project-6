document.addEventListener("DOMContentLoaded", function () {
  // --- Initialisation ---
  initDropdownMenu();
  initModalLogic();
  getBestMovie();
});

function initDropdownMenu() {
  // Dropdown Menu Logic
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
}

function initModalLogic() {
  // Modal Logic
  const detailsButton = document.getElementById("details-button");
  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("close-modal");

  // Open modal when "Details" button is clicked
  detailsButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
    console.log("Modal opened"); // Debugging log
  });

  // Close modal when "X" button is clicked
  closeModalButton.addEventListener("click", () => {
    modal.classList.add("hidden");
    console.log("Modal closed"); // Debugging log
  });

  // Close modal when clicking outside the modal content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
      console.log("Modal closed by clicking outside"); // Debugging log
    }
  });
}

async function getBestMovie() {
  const url = "http://localhost:8000/api/v1/titles/?imdb_score_min=9";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    var bestMovie = findBestMovie(data.results);
    bestMovie.description = await getMovieDescription(bestMovie);

    displayBestMovie(bestMovie);
  } catch (error) {
    console.error("Error fetching the best movies:", error);
  }
}

function findBestMovie(movies) {
  // Reduce compares each film with current, if current imdb_score is better then current, becomes best
  return movies.reduce((best, current) => {
    return current.imdb_score > best.imdb_score ? current : best;
  });
}

function displayBestMovie(movie) {
  console.log(movie);
  document.getElementById("best-movie-title").textContent = movie.title;
  document.getElementById("best-movie-description").textContent =
    movie.description;
  document.getElementById("best-movie-image").src =
    movie.image_url || "assets/images/default-image.jpg"; // Utilise une image par défaut si l'URL est manquante
}

async function getMovieDescription(movie) {
  try {
    const response = await fetch(movie.url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.description || "Description not available";
  } catch (error) {
    console.error("Error fetching the details of the best movie", error);
  }
}
