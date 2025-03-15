const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/static`));

const { errorHandler } = require("./errorHandler");

const GameController = require("./controllers/GameController");

// routes
// TODO Api versioning
app.use("/api/games", GameController);


app.listen(3000, () => {
  console.log('Server is up on port 3000');
});

// global error handler
app.use(errorHandler)

module.exports = app;
