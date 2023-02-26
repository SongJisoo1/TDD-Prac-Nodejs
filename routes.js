const express = require("express");
const productController = require("./controller/products");

const router = express.Router();

router.post("/", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:productId", productController.getProductsById);
router.patch("/:productId", productController.updateProduct);
router.delete("/:productId", productController.deleteProduct);

module.exports = router;
