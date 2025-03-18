function validator(obj, setter) {
  const keys = Object.keys(obj).sort((a, b) =>
    a === "email" ? -1 : b === "email" ? 1 : 0
  );

  let flag = true;

  for (let key of keys) {
    const value = obj[key];

    // Ensure value is a string before calling `trim()`
    if (!value || (typeof value === "string" && value.trim() === "")) {
      const keyName = key.charAt(0).toUpperCase() + key.slice(1);

      // Ensure setter is an object and has a function before calling it
      if (
        typeof setter === "object" &&
        typeof setter[keyName.toLowerCase()] === "function"
      ) {
        setter[keyName.toLowerCase()](
          `${keyName.replace("_", " ")} is required`
        );
      } else if (typeof setter === "function") {
        setter(`${keyName} is required`);
      }

      flag = false;
    }
  }

  return flag;
}

export default validator;
