const express = require("express");
const cors = require("cors");
require('./models/index');
const app = express();
const fs = require('fs');

const Routes = require("./routes")

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", Routes);

// simple route

app.use(express.static('uploads/'));


app.get("/", (req, res) => {
  res.json({ message: "Welcome to My Room App platefrom." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});