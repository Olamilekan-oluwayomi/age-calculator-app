/**
 * AgeController
 * Coordinates data operations and UI layout adjustments by mediating
 * between the AgeModel (Data) and AgeView (UI Display).
 */

import { AgeModel } from "../model/ageModel.js";
import { AgeView } from "../view/ageView.js";

export class AgeController {
  /**
   * Initializes the controller with its core operational components.
   * @param {AgeModel} model - Instance of the core calculation/validation engine
   * @param {AgeView} view - Instance of the DOM presentation layout worker
   */

  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Bind the form submission event to the handler method
    this.view.bindSubmit(this.handleAgeCalculation.bind(this));
  }

  /**
   * The core workflow engine triggered upon clicking the submit action.
   */

  handleAgeCalculation(event) {
    // 1. clear any existing error states from the UI
    this.view.clearErrors();

    // 2. Extract raw string values from the form inputs
    const { day, month, year } = this.view.getFormData();

    // 3. Validate for empty fields and render any errors
    const emptyFieldErrors = this.model.validateInputs(day, month, year);
    if (Object.keys(emptyFieldErrors).length > 0) {
      this.view.renderErrors(emptyFieldErrors);
      return; // Stop further processing if there are empty field errors
    }

    // 4. Parse the string inputs into integers for validation calculations
    const dayInt = parseInt(day, 10);
    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    // 5. LAYER 2 VALIDATION: Verify logical range rules (Pass the INTs! 🌟)
    const rangeErrors = this.model.validateRanges(dayInt, monthInt, yearInt);
    if (Object.keys(rangeErrors).length > 0) {
      this.view.renderErrors(rangeErrors);
      return;
    }

    // 6. LAYER 3 VALIDATION: Validate calendar combinations (Pass the INTs! 🌟)
    const calendarErrors = this.model.validateCalendarDate(
      dayInt,
      monthInt,
      yearInt,
    );
    if (Object.keys(calendarErrors).length > 0) {
      this.view.renderErrors(calendarErrors);
      return;
    }

    // 7. CALCULATION ENGINE: Process final age logic (Pass the INTs! 🌟)
    const finalAge = this.model.calculateAge(dayInt, monthInt, yearInt);

    // 8. RENDER RESULTS: Hand the clean data back to the View to update the screen
    this.view.renderResults(finalAge);
  }
}
