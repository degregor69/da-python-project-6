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

  // Définir une classe dynamique pour rows
  const gridRowsClass =
    window.innerWidth < 1024 ? "grid-rows-4" : "grid-rows-6";
  const mdGridRowsClass =
    window.innerWidth < 1024 ? "md:grid-rows-2" : "md:grid-rows-3";

  const showMoreButtonHTML =
    window.innerWidth < 1024
      ? `<button id="show-more-${index}" class="justify-center mt-4 block bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600">Voir plus</button>`
      : "";

  categorySection.innerHTML = `
      <h2 id="category-title-${index}" class="text-2xl font-bold mb-4">${category}</h2>
      <div id="category-${index}" class="grid grid-cols-1 ${gridRowsClass} gap-4 md:grid-cols-2 md:${mdGridRowsClass} lg:grid-cols-3 lg:grid-rows-2"></div>
      <div id="show-more-${index}" class="flex justify-center">${showMoreButtonHTML}</div>
    `;

  container.appendChild(categorySection);

  if (window.innerWidth < 1024) {
    const showMoreButton = document.getElementById(`show-more-${index}`);
    showMoreButton.addEventListener("click", () =>
      toggleShowMore(showMoreButton.id)
    );
  }
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
    movies.forEach((movie, index) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("relative", "group");

      if (
        movies.length >= 6 &&
        (index === 4 || index === 5) &&
        window.innerWidth < 1024
      ) {
        movieElement.classList.add("hidden");
      }

      movieElement.innerHTML = `
        <img
          src="${movie.image_url}"
          class="w-full max-h-[150px] lg:max-h-[300px] object-cover rounded-md shadow"
          alt="${movie.title}"
        />
        <div class="h-[50px] lg:h-[100px] absolute top-1/3 left-0 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold transition">
          <h3 class="text-white font-bold m-2">${movie.title}</h3>
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

const toggleShowMore = (buttonId) => {
  const index = buttonId.split("-")[2];
  const container = document.getElementById(`category-${index}`);
  const button = document.getElementById(`show-more-${index}`).firstChild;
  if (container) {
    if (container.classList.contains("grid-rows-4")) {
      container.classList.replace("grid-rows-4", "grid-rows-6");
      container.classList.replace("md:grid-rows-2", "md:grid-rows-3");

      const children = container.children;
      if (children.length > 4) {
        children[4].classList.remove("hidden");
        children[5].classList.remove("hidden");
        button.innerText = "Voir moins";
      }
    } else {
      container.classList.replace("grid-rows-6", "grid-rows-4");
      container.classList.replace("md:grid-rows-3", "md:grid-rows-2");

      const children = container.children;
      if (children.length > 4) {
        children[4].classList.add("hidden");
        children[5]?.classList.add("hidden");
        button.innerText = "Voir plus";
      }
    }
  } else {
    console.error(`Aucun conteneur trouvé avec l'ID : category-${index}`);
  }
};
