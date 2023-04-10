import { Router } from "express";
const router = Router();
import * as helpers from "../helpers.js";

router
  .route("/")
  .get(async (req, res) => {
    //code here for GET

    try {
      res.status(200).render("homepage", { title: "Tikit" });
    } catch (e) {
      res
        .status(500)
        .render("error", {
          title: "Error",
          error: "internal server error",
          code: "500",
        });
    }
  })
  .post(async (req, res) => {
    //code here for POST
  });

export default router;
