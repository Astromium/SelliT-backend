const express = require("express");
const { signUp, login, protect } = require("../controllers/authController");
const {
  uploadUserPhoto,
  resizeUserPhoto,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signUp);
router.route("/login").post(login);

router.route("/").get(getAllUsers);

router
  .route("/:id")
  .patch(protect, uploadUserPhoto, resizeUserPhoto, updateUser)
  .delete(deleteUser);

module.exports = router;
