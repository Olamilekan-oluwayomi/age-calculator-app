// The View is responsible for:

// Caching Elements: Finding our inputs, error containers, and result displays once at the start so we aren't slow down by constant DOM searches.

// Reading Form Values: Grabbing what the user typed so the controller can pass it to our model.

// Toggling Error States: Adding the .is-error class to the correct fields and injecting text.

// Rendering Output Numbers: Updating the -- placeholders with the correct age figures.

// Event Binding: Setting up a clean listener for the form submission.

/**
 * AgeView
 * Manages all DOM selectors, user input collections, text injections,
 * and CSS class toggles. It contains zero business or math logic.
 */

export class AgeView {
  constructor() {
    // 1. Cache structural layout blocks
    this.form = document.getElementById("ageForm");

    // 2. Cache Input elements
    this.inputs = {
      day: document.getElementById("day"),
      month: document.getElementById("month"),
      year: document.getElementById("year"),
    };

    // 3. Cache Control wrapper blocks (where .is-error class gets toggled)
    this.controls = {
      day: document.getElementById("dayControl"),
      month: document.getElementById("monthControl"),
      year: document.getElementById("yearControl"),
    };

    // 4. Cache dynamic display output placeholders
    this.results = {
      years: document.getElementById("resultYears"),
      months: document.getElementById("resultMonths"),
      days: document.getElementById("resultDays"),
    };
  }

  /**
   * Reads and extracts current string data from the input elements.
   * @returns {Object} Cleaned raw values from input boxes
   */
  getFormData() {
    return {
      day: this.inputs.day.value,
      month: this.inputs.month.value,
      year: this.inputs.year.value,
    };
  }

  /**
   * Applies active error states to specified inputs and injects message text.
   * @param {Object} errorsMap - Dictionary containing keys (day, month, year) mapping to error strings
   */

  renderErrors(errorsMap) {
    // Look at each field (day, month, year)
    Object.keys(errorsMap).forEach((fieldKey) => {
      const controlElement = this.controls[fieldKey];

      if (controlElement) {
        // Add the SCSS active modifier class to change labels/borders to red
        controlElement.classList.add("is-error");

        // Find the <small> tag nested inside this specific control block and inject text
        const errorTextElement = controlElement.querySelector(".error-message");
        if (errorTextElement) {
          errorTextElement.textContent = errorsMap[fieldKey];
        }
      }
    });
  }

  /**
   * Strips away all active error classes and wipes out warning message text.
   */

  clearErrors() {
    Object.values(this.controls).forEach((controlElement) => {
      controlElement.classList.remove("is-error");

      const errorTextElement = controlElement.querySelector(".error-message");
      if (errorTextElement) {
        errorTextElement.textContent = "";
      }
    });
  }

  /**
   * Animates the display boxes from 0 up to the calculated target results.
   * @param {Object} ageResult - Contains target { years, months, days } values
   */
  renderResults(ageResult) {
    // 1. Kick off an independent counter animation for each individual metric box
    this.animateValue(this.results.years, ageResult.years, 800);
    this.animateValue(this.results.months, ageResult.months, 800);
    this.animateValue(this.results.days, ageResult.days, 800);
  }

  /**
   * Utility helper that smoothly steps a text node integer up from 0 to its final state.
   * @param {HTMLElement} element - The target DOM element text placeholder
   * @param {number} endValue - The final calculation integer destination
   * @param {number} duration - Total animation lifecycle duration in milliseconds
   */
  animateValue(element, endValue, duration) {
    // If the value is 0 (e.g. 0 months old), display it immediately without running timers
    if (endValue === 0) {
      element.textContent = "0";
      return;
    }

    let startTimestamp = null;

    // This browser native function loops up to 60-120 frames per second smoothly
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;

      // Calculate how far along the timeline we are (0.0 to 1.0)
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Calculate the current frame integer value based on linear time interpolation
      const currentValue = Math.floor(progress * endValue);

      // Inject the current intermediate number frame into the UI display text node
      element.textContent = currentValue;

      // Keep repeating frames until progress timeline hits 100% (1)
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    // Initialize the official window animation frame request engine thread
    window.requestAnimationFrame(step);
  }

  /**
   * Attaches a managed event dispatcher to intercept form submissions safely.
   * @param {Function} handler - Callback routine executing in the controller context
   */
  bindSubmit(handler) {
    this.form.addEventListener("submit", (event) => {
      // Prevent browser from reloading the webpage on submit
      event.preventDefault();

      // Notify the controller that the form action happened
      handler();
    });
  }
}
