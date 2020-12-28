const express = require("express");
const { protect } = require("../controllers/authController");
const {
  uploadProductImages,
  resizeProductImages,
  createProduct,
  getProduct,
  deleteProduct,
  getProducts,
} = require("../controllers/productController");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, uploadProductImages, resizeProductImages, createProduct);

router.route("/:id").get(getProduct).delete(protect, deleteProduct);

module.exports = router;
