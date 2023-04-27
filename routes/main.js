import { Router } from "express";
const router = Router();
import * as helpers from "../helpers.js";
import users from "../data/users.js";

router
  .route("/")
  .get(
    (req, res, next) => {
      if (!req.session.user) {
        req.method = "GET";
        return res.redirect("/login");
      }
      next();
    },
    async (req, res) => {
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
    }
  )
  .post(async (req, res) => {
    //code here for POST
  });

router
  .route("/login")
  .get(
    (req, res, next) => {
      if (req.session.user) {
        res.redirect("/");
      } else {
        req.method = "GET";
        next();
      }
    },
    async (req, res) => {
      //code here for GET
      try {
        res.status(200).render("login", { title: "Login", loginPage: true });
      } catch (e) {
        res.status(500).render("error", {
          title: "Error",
          error: "internal server error",
          code: "500",
        });
      }
    }
  )
  .post(async (req, res) => {
    try {
      if (
        req.body.hasOwnProperty("emailAddressInput") &&
        req.body.hasOwnProperty("passwordInput")
      ) {
        let email = helpers.validateEmail(req.body.emailAddressInput);
        let password = helpers.checkPassword(req.body.passwordInput);

        let user = await users.checkUser(email, password);

        if (user) {
          req.session.user = user;
          res.redirect("/");
        } else {
          throw new Error("unable to login");
        }
      }
    } catch (e) {
      res.status(400).render("login", { title: "Login", error: `${e}`, loginPage: true });
    }
  });

router.route("/logout").get(
  (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    } else {
      next();
    }
  },
  async (req, res) => {
    //code here for GET
    req.session.destroy();
    res.redirect("/");
  }
);

router
  .route("/register")
  .get(
    (req, res, next) => {
      if (req.session.user) {
        return res.redirect("/");
      } else {
        req.method = "GET";
        next();
      }
    },
    async (req, res) => {
      //code here for GET
      try {
        res.status(200).render("register", { title: "Register", loginPage: true });
      } catch (e) {
        res.status(500).render("error", {
          title: "Error",
          error: "internal server error",
          code: "500",
        });
      }
    }
  )
  .post(async (req, res) => {
    //code here for POST
    try {
      if (
        req.body.hasOwnProperty("firstNameInput") &&
        req.body.hasOwnProperty("lastNameInput") &&
        req.body.hasOwnProperty("emailAddressInput") &&
        req.body.hasOwnProperty("usernameInput") &&
        req.body.hasOwnProperty("passwordInput") &&
        req.body.hasOwnProperty("confirmPasswordInput")
      ) {
        let firstName = helpers.checkString(
          req.body["firstNameInput"],
          "first name"
        );
        let lastName = helpers.checkString(
          req.body["lastNameInput"],
          "last name"
        );
        let emailAddress = helpers.validateEmail(req.body["emailAddressInput"]);
        let username = helpers.checkString(req.body["usernameInput"]);
        let password = helpers.checkPassword(req.body["passwordInput"]);
        if (password != req.body["confirmPasswordInput"]) {
          throw new Error("your passwords do not match");
        }

        let user = await users.create(
          firstName,
          lastName,
          username,
          password,
          req.body["confirmPasswordInput"],
          emailAddress,
          "User", // default role
          "User" // default title
        );

        if (user) {
          // res.status(200).render("login", { title: "Login" });
          res.status(200).redirect("/login");
        } else {
          throw new Error("unable to create user");
        }
      }
    } catch (e) {
      // render form with 400 code
      res.status(400).render("register", { title: "Register", error: `${e}`, loginPage: true });
    }
  });

export default router;
