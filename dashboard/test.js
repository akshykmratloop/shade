let a = { a: "a", b: { c: "D" } }

const c = (obj) => {
    obj.b.c = "E"
}

c(a)

console.log(a)