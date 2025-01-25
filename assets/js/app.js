const getMovies = async (pageSize, genre, sortBy) => {
  const baseUrl = "http://localhost:8000/api/v1/titles";
  const url = new URL(baseUrl);

  if (pageSize) {
    url.searchParams.append("page_size", pageSize);
  }

  if (genre) {
    url.searchParams.append("genre", genre);
  }

  if (sortBy) {
    url.searchParams.append("sort_by", sortBy);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching the movies:", error);
  }
};

const initCategoryTitle = (category) => {
  const categoryTitleElement = document.getElementById("first-category-title");
  if (categoryTitleElement) {
    categoryTitleElement.textContent = category;
  }
};

const createCategorySection = (category, index, containerId) => {
  const container = document.getElementById(containerId);

  const categorySection = document.createElement("div");
  categorySection.classList.add("p-4", "my-6");

  categorySection.innerHTML = `
    <h2 id="category-title-${index}" class="text-2xl font-bold mb-4">${category}</h2>
    <div id="category-${index}" class="grid grid-cols-3 grid-rows-2 gap-4"></div>
  `;

  container.appendChild(categorySection);
};

const displayMoviesInExistingContainer = (movies, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID ${containerId} not found.`);
    return;
  }

  container.innerHTML = "";

  if (!Array.isArray(movies) || movies.length === 0) {
    container.innerHTML = "<p>Aucun film trouvé pour cette catégorie.</p>";
  } else {
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
  }
};
