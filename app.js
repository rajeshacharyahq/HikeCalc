const form = document.querySelector("#calculator-form");
const currentSalaryInput = document.querySelector("#current-salary");
const hikePercentageInput = document.querySelector("#hike-percentage");
const updatedSalaryInput = document.querySelector("#updated-salary");
const errorMessage = document.querySelector("#error-message");
const resultSalary = document.querySelector("#result-salary");
const resultPercentage = document.querySelector("#result-percentage");
const resultIncrease = document.querySelector("#result-increase");
const resetButton = document.querySelector("#reset-button");
const modeTabs = document.querySelectorAll(".mode-tab");
const modeFields = document.querySelectorAll("[data-field]");

let mode = "percentage";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

const percentFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2
});

function numberFromInput(input) {
  return Number.parseFloat(input.value);
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = "";
}

function setResults(updatedSalary, percentage, increase) {
  resultSalary.textContent = currencyFormatter.format(updatedSalary);
  resultPercentage.textContent = `${percentFormatter.format(percentage)}%`;
  resultIncrease.textContent = currencyFormatter.format(increase);
}

function resetResults() {
  setResults(0, 0, 0);
}

function validateCurrentSalary(currentSalary) {
  if (!Number.isFinite(currentSalary) || currentSalary <= 0) {
    showError("Enter a current salary greater than 0.");
    currentSalaryInput.focus();
    return false;
  }

  return true;
}

function calculateByPercentage() {
  const currentSalary = numberFromInput(currentSalaryInput);
  const percentage = numberFromInput(hikePercentageInput);

  if (!validateCurrentSalary(currentSalary)) {
    return;
  }

  if (!Number.isFinite(percentage)) {
    showError("Enter the hike percentage.");
    hikePercentageInput.focus();
    return;
  }

  const increase = currentSalary * (percentage / 100);
  const updatedSalary = currentSalary + increase;
  clearError();
  setResults(updatedSalary, percentage, increase);
}

function calculateByUpdatedSalary() {
  const currentSalary = numberFromInput(currentSalaryInput);
  const updatedSalary = numberFromInput(updatedSalaryInput);

  if (!validateCurrentSalary(currentSalary)) {
    return;
  }

  if (!Number.isFinite(updatedSalary) || updatedSalary < 0) {
    showError("Enter the updated salary.");
    updatedSalaryInput.focus();
    return;
  }

  const increase = updatedSalary - currentSalary;
  const percentage = (increase / currentSalary) * 100;
  clearError();
  setResults(updatedSalary, percentage, increase);
}

function calculate() {
  if (mode === "percentage") {
    calculateByPercentage();
    return;
  }

  calculateByUpdatedSalary();
}

function setMode(nextMode) {
  mode = nextMode;

  modeTabs.forEach((tab) => {
    const isActive = tab.dataset.mode === mode;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  modeFields.forEach((field) => {
    field.classList.toggle("hidden", field.dataset.field !== mode);
  });

  clearError();
  resetResults();
}

modeTabs.forEach((tab) => {
  tab.addEventListener("click", () => setMode(tab.dataset.mode));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculate();
});

[currentSalaryInput, hikePercentageInput, updatedSalaryInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value === "") {
      clearError();
      resetResults();
      return;
    }

    calculate();
  });
});

resetButton.addEventListener("click", () => {
  form.reset();
  clearError();
  resetResults();
  currentSalaryInput.focus();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The app still works without offline support if registration fails.
    });
  });
}
