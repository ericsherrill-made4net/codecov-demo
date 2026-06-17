const axios = require('axios')
const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();

const backendHost = 'http://localhost';
const backendPort = '8080';

app.use(express.json());
app.use("/static", express.static(path.resolve(__dirname, "static")));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

const allowedOperations = new Set(["login", "register", "reset-password"]);

app.post("/api/:operation", (req, res) => {
  const operation = req.params.operation;

  if (!allowedOperations.has(operation)) {
    return res.status(400).json({ error: "Invalid operation" });
  }

  axios.post(
    backendHost + ':' + backendPort + '/api/' + encodeURIComponent(operation),
    req.body
  ).then(response => {
    res.json(response.data);
  }).catch(error => {
    console.log("Error: " + error);
  });
});

app.get("/", limiter, (req, res) => {
  res.sendFile(path.resolve("index.html"));
});
app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
