import express from "express";
import {
  INSERT_USER,
  LOGIN_USER,
  GET_ALL_USERS,
  UPDATE_USERS_BY_IDS,
  DELETE_USERS_BY_IDS,
  VERIFY_EMAIL,
} from "../controllers/users.js";
import validate from "../middlewares/validation.js";
import auth from "../middlewares/auth.js";
import userSchema from "../schemas/user.js";
import loginSchema from "../schemas/login.js";

const router = express.Router();

router.get("/", auth, GET_ALL_USERS);
router.post("/register", validate(userSchema), INSERT_USER);
router.post("/login", validate(loginSchema), LOGIN_USER);
router.post("/verify-email", VERIFY_EMAIL);
router.put("/update", auth, UPDATE_USERS_BY_IDS);
router.delete("/delete", auth, DELETE_USERS_BY_IDS);

export default router;
