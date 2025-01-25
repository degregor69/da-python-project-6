document.addEventListener("DOMContentLoaded", () => {
  const genres = ["Sci-Fi", "Comedy"];
  genres.forEach((genre, index) => {
    getMovies(6, genre, "-imdb_score").then((movies) => {
      createCategorySection(genre, index, "fixed-categories-container");
      displayMoviesInExistingContainer(movies, `category-${index}`);
    });
  });
});
