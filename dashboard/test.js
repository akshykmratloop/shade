
let mainArray = [
    "PAGE_MANAGEMENT",
    "SERVICE_MANAGEMENT",
    "MARKET_MANAGEMENT",
    "PROJECT_MANAGEMENT",
    "NEWS_BLOGS_MANAGEMENT",
    "CAREER_MANAGEMENT",
    "ROLES_PERMISSION_MANAGEMENT",
    "USER_MANAGEMENT",
    "SINGLE_RESOURCE_MANAGEMENT",
    "HEADER_MANAGEMENT",
    "FOOTER_MANAGEMENT",
    "TESTIMONIAL_MANAGEMENT",
    "AUDIT_LOGS_MANAGEMENT"
]

let array = [
    "PAGE_MANAGEMENT",
    ["HEADER_MANAGEMENT", "FOOTER_MANAGEMENT"]
]

// let hasMatch = checkArray.some(item => mainArray.includes(item));
// let isMatch = array.some(item => {
//     if (Array.isArray(item)) {
//       return item.some(subItem => mainArray.includes(subItem));
//     } else {
//       return mainArray.includes(item);
//     }
//   });
// console.log(hasMatch); // true
// console.log( "MANAGEMENT" === "USER_MANAGEMENT".slice(-10))

let testArray1 = ["PAGE_MANAGEMENT", "EDIT", "ROLES_MANAGEMENT", "USER_MANAGEMENT"]

let testArray2 = [{ permission: "MANAGEMENT", text: "manager" }, { permission: "EDIT", text: "editor" }, { permission: "_MANAGEMENT", text: "Publisher" }]

const finalArray = testArray2.map((e, i) => {
    if (testArray1[i].slice(-10) === e.permission && testArray1[i].slice !== "ROLE") {
        return e.text
    } else if (testArray1[i] === e.permission) {
        return e
    } else {
        return 0
    }
}).filter(e => e)

console.log(finalArray)