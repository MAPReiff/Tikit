import { Router } from "express";
const router = Router();
import * as helpers from "../helpers.js";
import users from "../data/users.js";
import {ticketData} from '../data/index.js';

router
.route('/')
.get((req, res, next) => {
  if (!req.session.user) {
    req.method = "GET";
    return res.redirect("/login");
  }
  next();
},
async (req, res) => {
  let tickets;
  try{
    tickets = await ticketData.getAll(req.session.user.role === "admin", req.session.user._id);
  }catch(e) {
    // console.log(e);
    helpers.renderError(res, 404, 'Issue Retrieving tickets');
    return;
  }

  for(let ticket of tickets){
    ticket.createdOn = !ticket.createdOn ? "N/A" : new Date(ticket.createdOn).toLocaleDateString();
    ticket.deadline = !ticket.deadline ? "N/A" : new Date(ticket.deadline).toLocaleDateString();
  }

  try {
    res.status(200).render("allTicketsView", {
      title: "Tickets View",
      user_id: req.session.user._id,
      tickets: tickets,
      query: ""
    });
  }catch(e) {
    helpers.renderError(res, 500, 'Internal Server Error');
  }
  //code here for GET
})
.post(async (req, res) => {
  //code here for POST
  let { searchTickets } = req.body;
  let tickets;

  try{

    if(!searchTickets){
      searchTickets = req.body.search;
    }
    
    tickets = await ticketData.search(searchTickets, 
      req.session.user._id, 
      req.session.user.role === "admin");

    for(let ticket of tickets){
      ticket.createdOn = !ticket.createdOn ? "N/A" : new Date(ticket.createdOn).toLocaleDateString();
      ticket.deadline = !ticket.deadline ? "N/A" : new Date(ticket.deadline).toLocaleDateString();
    }


  }catch(e) {
    helpers.renderError(res, 404, 'Issue Retrieving ticket(s)');
    return;
  }

  try {
    res.status(200).render("allTicketsView", {
      title: "Tickets View",
      user_id: req.session.user._id,
      tickets: tickets,
      query: searchTickets
    });
  }catch(e) {
    helpers.renderError(res, 500, 'Internal Server Error');
  }
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
        res.status(200).render("login", { 
        title: "Login", 
        loginPage: true });
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
        let email = helpers.checkEmail(req.body.emailAddressInput);
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
      res.status(400).render("login", { 
        title: "Login", 
        // user_id: req.session.user._id,
        error: `${e}`, loginPage: true });
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
        res.status(200).render("register", { 
          title: "Register", 
          // user_id: req.session.user._id,
          loginPage: true });
      } catch (e) {
        res.status(500).render("error", {
          title: "Error",
          // user_id: req.session.user._id,
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
        let emailAddress = helpers.checkEmail(req.body["emailAddressInput"]);
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
      res.status(400).render("register", { 
        title: "Register", 
        // user_id: req.session.user._id,
        error: `${e}`, 
        loginPage: true });
    }
  });


  // router.route('/error/:errorCode').get(
  //   (req, res, next) => {
  //     if (!req.session.user) {
  //       return res.redirect('/login');
  //     }
  //     next();
  //   }, 
  //   async (req, res) => {
  //   //code here for GET
  //   if( req.params.errorCode === '500'){ 
  //     renderErrorGeneric(res, 500, 'Error: Internal Server Problem');
  //   } else if( req.params.errorCode === '404') { 
  //     renderErrorGeneric(res, 404, 'Error: Resource Not Found');
  //   } else if( req.params.errorCode === '403') { 
  //     renderErrorGeneric(res, 403, 'Error: Request Forbidden Error');
  //   } else if(req.params.errorCode === '400') { 
  //     renderErrorGeneric(res, 400, 'Error: Bad Request');
  //   } else { 
  //     renderErrorGeneric(res, '', 'Oops, something went wrong!');
  //   }
  //   //res.status(403).render('error', {title: "Error Page", error: "Sorry, you do not have permission to access to this page"});
  // });

export default router;
