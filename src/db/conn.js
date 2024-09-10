require('dotenv').config();
const mongoose = require("mongoose");

const a = mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(`Connected to database`))
.catch((err) => console.error(`Error connecting to database ${err}`));