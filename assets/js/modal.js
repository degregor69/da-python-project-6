// Opening Modal

document.addEventListener("click", function (event) {
  const movieUrl = findMovieUrl(event);
  if (!movieUrl) {
    return;
  }
  showMovieDetails(movieUrl);
});

const findMovieUrl = (event) => {
  if (!event.target.classList.contains("details-button")) {
    return null;
  }
  return event.target.getAttribute("data-url");
};

const showMovieDetails = async (movieUrl) => {
  try {
    const movieData = await fetchMovieDetails(movieUrl);
    populateModal(movieData);
    displayModal();
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
};

const fetchMovieDetails = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }
  return response.json();
};

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

const displayModal = () => {
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
};

// Closing Modal
document.querySelectorAll(".close-modal").forEach((element) => {
  element.addEventListener("click", () => {
    closeModal();
  });
});

const closeModal = () => {
  document.getElementById("modal").classList.add("hidden");
};
