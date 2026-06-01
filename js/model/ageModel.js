/**
 * AgeModel
 * Handles pure data validation and age calculation logic.
 * It remains entirely independent of the DOM.
 */

// Empty Checks: Verify if the day, month, or year values are missing.

// Range Validation: Ensure the Day is 1–31, Month is 1–12, and Year isn't in the future.

// Calendar Validation: Validate that the date physically exists (e.g., catching 31/04/1991 since April only has 30 days, or checking for leap years).

// Age Calculation Engine: Perform accurate calendar math to calculate the difference between the birth date and today's current date in precise years, months, and days.

export class AgeModel {
  constructor() {
    // Initialize properties to hold validated input values
    this.day = null;
    this.month = null;
    this.year = null;
  }

  /**
   * Validates the raw form inputs for empty fields.
   * @param {string} dayStr - Raw string value from the day input
   * @param {string} monthStr - Raw string value from the month input
   * @param {string} yearStr - Raw string value from the year input
   * @returns {Object} An object containing error messages mapped by field ID
   */

  validateInputs(dayStr, monthStr, yearStr) {
    const errors = {};

    // Check for empty fields

    if (!dayStr || !dayStr.trim() === "") {
      errors.day = "This field is required";
    }
    if (!monthStr || !monthStr.trim() === "") {
      errors.month = "This field is required";
    }
    if (!yearStr || !yearStr.trim() === "") {
      errors.year = "This field is required";
    }

    return errors;
  }

  /**
   * Validates that the input numbers fall within plausible calendar ranges.
   * @param {number} day - Parsed integer for day
   * @param {number} month - Parsed integer for month
   * @param {number} year - Parsed integer for year
   * @returns {Object} An object containing error messages mapped by field ID
   */

  validateRanges(day, month, year) {
    const errors = {};
    const currentYear = new Date().getFullYear();

    if (day < 1 || day > 31) {
      errors.day = "Must be a valid day (1-31)";
    }

    if (month < 1 || month > 12) {
      errors.month = "Must be a valid month (1-12)";
    }

    if (year > currentYear) {
      errors.year = "Must be in the past";
    }
    return errors;
  }

  /**
   * Validates if a date physically exists on the calendar and is not a future date.
   * @param {number} day - Parsed integer for day
   * @param {number} month - Parsed integer for month (1-indexed: 1 = Jan)
   * @param {number} year - Parsed integer for year
   * @returns {Object} An object containing error messages if the full date is invalid
   */

  validateCalendarDate(day, month, year) {
    const errors = {};

    // 1. Structural Calendar Existence Check (e.g., Leap Years, Month Lengths)
    // In JS, Month parameter is 0-indexed (0 = January, 1 = February, etc.)
    const date = new Date(year, month - 1, day);

    // If JavaScript shifts the date automatically, it means the input date doesn't exist!
    // Example: new Date(1991, 3, 31) auto-rolls into May 1st because April has 30 days.
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      errors.day = "Must be a valid calendar date";
      return errors;
    }

    // 2. Real-Time Future Constraint Check
    const today = new Date();
    if (date > today) {
      errors.day = "Date cannot be in the future";
    }

    return errors;
  }

  /**
   * Calculates the exact age in years, months, and days relative to the current date.
   * @param {number} birthDay - Parsed integer for birth day
   * @param {number} birthMonth - Parsed integer for birth month (1-12)
   * @param {number} birthYear - Parsed integer for birth year
   * @returns {Object} An object containing the precise calculated years, months, and days
   */

  calculateAge(birthDay, birthMonth, birthYear) {
    const today = new Date();

    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth() + 1; // JS months are 0-indexed, so we add 1 for human-friendly month numbers
    let currentDay = today.getDate();

    // Initial rough calculation of age components
    let ageYears = currentYear - birthYear;
    let ageMonths = currentMonth - birthMonth;
    let ageDays = currentDay - birthDay;

    // 2. Handle Day Borrowing
    // If the current day of the month is less than the birth day, we must borrow days
    // from the previous month.

    if (ageDays < 0) {
      // Find out exactly how many days were in the *previous* calendar month
      // In JS, setting the day parameter to '0' on a Date constructor returns
      // the last day of the prior month.
      const daysInPreviousMonth = new Date(
        currentYear,
        currentMonth - 1,
        0,
      ).getDate();

      ageDays += daysInPreviousMonth;
      ageMonths -= 1; // Pay back the borrowed month
    }

    // 3. Handle Month Borrowing
    // If our calculated months value dips below zero, we must borrow a full year (12 months).
    if (ageMonths < 0) {
      ageMonths += 12;
      ageYears -= 1; // Pay back the borrowed year
    }

    // 4. Update internal state and return the precise truth
    this.age = {
      years: ageYears,
      months: ageMonths,
      days: ageDays,
    };

    return this.age;
  }
}
