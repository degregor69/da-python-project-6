document.addEventListener("DOMContentLoaded", function () {
  // --- Initialisation ---
  initDropdownMenu();
  initModalLogic();
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
