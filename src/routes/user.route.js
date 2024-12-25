import {
    getAllUsers,
    getUserById,
    register,
    login,
    uploadUserProfile,
    deleteAll
  } from "../controllers/user.controller.js";
  import { Router } from "express";
  const router = Router();
  
  router.route("/get/all").get(getAllUsers);
  router.route("/get/by/:id").get(getUserById);
  router.route("/register").post(register);
  router.route("/login").post(login);
  router.route("/delete-all").delete(deleteAll);
  router.route("/update/profile/:id").post(uploadUserProfile);
  
  export default router;
  