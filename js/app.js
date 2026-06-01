// 📦 Import the architectural MVC layers
import { AgeModel } from "./model/ageModel.js";
import { AgeView } from "./view/ageView.js";
import { AgeController } from "./controller/ageController.js";

// 🚀 Boot up the application when the DOM is fully parsed and secure
document.addEventListener("DOMContentLoaded", () => {
  // 1. Create independent instances of our data and UI systems
  const model = new AgeModel();
  const view = new AgeView();

  // 2. Inject both instances into the Controller manager to kick off event binding
  const app = new AgeController(model, view);

  console.log(
    "🎉 Age Calculator Application successfully initialized under MVC architecture!",
  );
});
