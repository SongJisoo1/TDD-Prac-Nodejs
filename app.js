const express = require("express");

const connect = require("./schemas/index");
const productRoutes = require("./routes");

const app = express();
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/products", productRoutes);

app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(error.status || 500).json({ errorMessage: error.message });
});

module.exports = app;
