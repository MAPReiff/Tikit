import { Router } from "express";
const router = Router();
import * as helpers from "../helpers.js";
import users from "../data/users.js";

router
  .route("/")
  .get(async (req, res) => {
    //code here for GET

    try {
      res.status(200).render("homepage", { title: "Tikit" });
    } catch (e) {
      res.status(500).render("error", {
        title: "Error",
        error: "internal server error",
        code: "500",
      });
    }
  })
  .post(async (req, res) => {
    //code here for POST
  });

router
  .route("/login")
  .get(async (req, res) => {
    //code here for GET
    try {
      res.status(200).render("login", { title: "Login" });
    } catch (e) {
      res.status(500).render("error", {
        title: "Error",
        error: "internal server error",
        code: "500",
      });
    }
  })
  .post(async (req, res) => {
    try {
      if (
        req.body.hasOwnProperty("emailAddressInput") &&
        req.body.hasOwnProperty("passwordInput")
      ) {
        let email = helpers.checkEmail(req.body.emailAddressInput);
        let password = helpers.checkPassword(req.body.passwordInput);

        let user = await users.checkUser(email, password);
        
        if (user) {
          req.session.user = user;
          res.status(200).json({ login: true });
        } else {
          throw new Error("unable to login");
        }
      }
    } catch (e) {
      res.status(400).render("login", { title: "Login", error: `${e}` });
    }
  });
export default router;
