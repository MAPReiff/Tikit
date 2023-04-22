import { Router } from "express";
const router = Router();
import { ticketData } from "../data/index.js";
import { userData } from "../data/index.js";
import * as helpers from "../helpers.js";

router
  .route("/")
  .get(async (req, res) => {
    try {
      let users = await userData.getAll();

      res.status(200).render("allUsersView", {
        title: "Users View",
        tickets: users,
      });
    } catch (e) {
      res.status(404).render("404", {
        title: "404 Tickets not found",
        msg: "Error 404: Issue Retrieving tickets",
      });
    }
    //code here for GET
  })
  .post(async (req, res) => {
    //code here for POST
  });

router.route("/view/:id").get(async (req, res) => {
  try {
    let user = await userData.get(req.params.id);
    const name = `${user.firstName} ${user.lastName}`;
    if (req.session.user.role.toLowerCase() === "admin") {
      res.status(200).render("userView", {
        id: user._id,
        name: name,
        username: user.username,
        email: user.email,
        role: user.role,
        title: user.title,
        createdTickets: await ticketData.getMultiple(user.createdTickets),
        ownedTickets: await ticketData.getMultiple(user.ticketsBeingWorkedOn),
        commentsLeft: user.commentsLeft,
        admin: true,
      });
    } else {
      res.status(200).render("userView", {
        id: user._id,
        name: name,
        username: user.username,
        email: user.email,
        role: user.role,
        title: user.title,
        createdTickets: await ticketData.getMultiple(user.createdTickets),
        ownedTickets: await ticketData.getMultiple(user.ticketsBeingWorkedOn),
        commentsLeft: user.commentsLeft,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(404).render("404", {
      title: "404 User not found",
      msg: "Error 404: User ID Not Found",
    });
  }

  //code here for GET
});

router
  .route("/edit/:id")
  .get(async (req, res) => {
    try {
      let user = await userData.get(req.params.id);
      let adminUser = req.session.user;
      const name = `${user.firstName} ${user.lastName}`;
      res.status(200).render("userEdit", {
        id: user._id,
        name: name,
        username: user.username,
        email: user.email,
        role: user.role,
        title: user.title,
        createdTickets: await ticketData.getMultiple(user.createdTickets),
        ownedTickets: await ticketData.getMultiple(user.ticketsBeingWorkedOn),
        commentsLeft: user.commentsLeft,
        adminID: adminUser._id,
      });
    } catch (e) {
      console.log(e);
      res.status(404).render("404", {
        title: "404 User not found",
        msg: "Error 404: User ID Not Found",
      });
    }
  })
  .post(async (req, res) => {
    try {
      if (
        req.body.hasOwnProperty("roleInput") &&
        req.body.hasOwnProperty("titleInput") &&
        req.body.hasOwnProperty("userIDInput") &&
        req.body.hasOwnProperty("adminIDInput")
      ) {
        let adminUser = await userData.get(req.body.adminIDInput);
        if (adminUser.role.toLowerCase() === "admin") {
          await userData.editUserRoleTitle(
            req.body.userIDInput,
            req.session.user._id,
            req.body.roleInput,
            req.body.titleInput
          );
          res.status(200).redirect(`/users/view/${req.body.userIDInput}`);
        } else {
          res.status(403).render("403", {
            title: "403 Forbidden",
            msg: "Error 403: Forbidden",
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).render("404", {
        title: "404 User not found",
        msg: "Error 404: User ID Not Found",
      });
    }
  });

export default router;
