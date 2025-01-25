document.addEventListener("DOMContentLoaded", async () => {
  const index = 999;
  const sixBestMovies = await getMovies(6, "", "-imdb_score");
  createCategorySection("Meilleurs films", index, "best-movies-container");
  displayMoviesInExistingContainer(sixBestMovies, `category-${index}`);
});
