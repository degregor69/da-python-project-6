document.addEventListener("DOMContentLoaded", () => {
  getBestMovie();
});

const getBestMovie = async () => {
  const bestMovieResponse = await getMovies(1, "", "-imdb_score");
  const bestMovie = bestMovieResponse[0];
  bestMovie.description = await getMovieDescription(bestMovie);
  displayBestMovie(bestMovie);
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
