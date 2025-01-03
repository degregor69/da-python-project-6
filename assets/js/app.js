document.addEventListener("DOMContentLoaded", function () {
  // --- Dropdown Menu Logic ---
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

  // Sélectionnez les éléments
  const detailsButton = document.getElementById("details-button");
  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("close-modal");

  // Afficher la modale lorsque le bouton "Détails" est cliqué
  detailsButton.addEventListener("click", () => {
    modal.classList.remove("hidden"); // Affiche la modale
    console.log("Modal opened"); // Debugging log
  });

  // Fermer la modale lorsque le bouton "X" est cliqué
  closeModalButton.addEventListener("click", () => {
    modal.classList.add("hidden"); // Cache la modale
    console.log("Modal closed"); // Debugging log
  });

  // Fermer la modale lorsque l'utilisateur clique en dehors du contenu
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
      console.log("Modal closed by clicking outside"); // Debugging log
    }
  });
});
