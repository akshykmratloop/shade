import AppError from "./AppError.js";

// Function to assert a condition, if the condition is not met, it throws an error
const assert = (condition, errorName, message) => {
  if (condition) return;
  throw new AppError(errorName, message);
};

// Function to assert every condition in an array, if any condition is not met, it throws an error
const assertEvery = (conditionArray) => {
  conditionArray.forEach((condition) => assert(condition.condition, condition.errorName, condition.message));
};

export { assert, assertEvery };
