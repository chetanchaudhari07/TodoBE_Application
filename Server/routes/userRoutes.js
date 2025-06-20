const express = require("express");
const router = express.Router();
const {registerUser,loginUser,getProfile,updateProfile,deleteUser}= require("../controller/userController");
const auth = require("../middleware/auth");


router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.delete("/profile", auth, deleteUser);

module.exports = router;
