const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
