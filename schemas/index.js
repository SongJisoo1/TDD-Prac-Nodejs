require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connect = () => {
    if (process.env.NODE_ENV !== "production") {
        mongoose.set("debug", true);
    }

    mongoose
        .connect(process.env.DB_URL, {
            dbName: "tdd",
        })
        .then(() => {
            console.log("MongoDB connect");
        })
        .catch(error => {
            console.log("db connect error", error);
        });
};

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", error => {
    console.error("Mongoose connected error", error);
});

module.exports = connect;
