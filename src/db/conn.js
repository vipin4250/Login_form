const mongoose = require("mongoose");

const a = mongoose.connect("mongodb://127.0.0.1:27017/loginRegisteration")
.then(() => console.log(`Connected to database`))
.catch((err) => console.error(`Error connecting to database ${err}`));