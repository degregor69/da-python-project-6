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
  const categorySection = document.createElement("section");
  categorySection.classList.add("p-4", "my-6");

  const showMoreButtonHTML =
    window.innerWidth < 1024
      ? `<button id="show-more-${index}" class="justify-center mt-4 block bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600" data-expanded="false">Voir plus</button>`
      : "";

  categorySection.innerHTML = `
      <header>
        <h2 id="category-title-${index}" class="text-2xl font-bold mb-4">${category}</h2>
      </header>
      <ul id="category-${index}" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Liste des films"></ul>
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
    const initialVisible =
      window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 4 : 6;

    movies.forEach((movie, index) => {
      const movieElement = document.createElement("li");
      movieElement.classList.add("relative", "group", "list-none");

      if (index >= initialVisible) {
        movieElement.classList.add("hidden");
      }

      movieElement.innerHTML = `
      <article class="flex flex-col items-center">
        <img 
          src="${movie.image_url || "https://picsum.photos/400/400"}" 
          class="w-full max-h-[150px] lg:max-h-[300px] object-cover rounded-md shadow" 
          alt="Affiche du film ${movie.title}" 
          onError="this.onerror=null; this.src='https://picsum.photos/200/300';" />
        <header class="h-1/3 absolute top-1/3 left-0 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold transition">
          <h3 class="text-white font-bold m-2">${movie.title}</h3>
          <button class="details-button bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full ml-auto mt-auto mb-2 block" data-url="${
            movie.url
          }">Détails</button>
        </header>
      </article>
`;

      container.appendChild(movieElement);
    });
  }
};

const toggleShowMore = (buttonId) => {
  const index = buttonId.split("-")[2];
  const container = document.getElementById(`category-${index}`);
  const button = document.getElementById(`show-more-${index}`).firstChild;
  const initialVisible =
    window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 4 : 6;

  if (button.innerText == "Voir plus") {
    const children = container.children;
    for (let i = initialVisible; i < children.length; i++) {
      children[i].classList.remove("hidden");
    }
    button.innerText = "Voir moins";
  } else {
    const children = container.children;
    for (let i = initialVisible; i < children.length; i++) {
      children[i].classList.add("hidden");
    }
    button.innerText = "Voir plus";
  }
};
