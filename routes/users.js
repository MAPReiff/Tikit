import { Router } from "express";
const router = Router();
import {ticketData} from '../data/index.js';
import {userData} from '../data/index.js';
import { renderError } from '../helpers.js';

router
  .route("/")
  .get(async (req, res) => {
    let users;

    try {
      users = await userData.getAll();
    }catch(e) {
      renderError(res, 404, 'Issue Retrieving users');
    }

    try{
      res.status(200).render("allUsersView", {
        title: "Users View",
        users: users,
        query: ""
      });
    }catch(e) {
      renderError(res, 500, 'Internal Server Error');
    }
  })
  .post(async (req, res) => {
    let users;
    const { search } = req.body;

    try {
      users = await userData.search(search);
    }catch(e) {
      renderError(res, 404, 'User(s) not found');
    }

    try{
      res.status(200).render("allUsersView", {
        title: "Users View",
        users: users,
        query: search
      });
    }catch(e) {
      renderError(res, 500, 'Internal Server Error');
    }
  });

router.route("/view/:id").get(async (req, res) => {
  try {
    let user = await userData.get(req.params.id);
    const name = `${user.firstName} ${user.lastName}`;
    res.status(200).render("userView", {
      id: user._id,
      name: name,
      username: user.username,
      email: user.email,
      role: user.role,
      title: user.title,
      createdTickets: await ticketData.getMultiple(user.createdTickets.map((ticket) => {
        return ticket.toString();
      })),
      ownedTickets: await ticketData.getMultiple(user.ticketsBeingWorkedOn.map((ticket) => {
        return ticket.toString();
      })),
      commentsLeft: user.commentsLeft,
      admin: (req.session.user.role.toLowerCase() === "admin"),
    });
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
  .get(
    (req, res, next) => {
      if (req.session.user.role.toLowerCase() !== "admin") {
        return renderError(res, 403, 'Forbidden - Only admins can edit users');
      } else {
        req.method = "GET";
        next();
      }
    },
    async (req, res) => {
    let user;
    try {
      user = await userData.get(req.params.id);
    }catch(e) {
      renderError(res, 404, 'User not found');
    }

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
        createdTickets: await ticketData.getMultiple(user.createdTickets.map((ticket) => {
          return ticket.toString();
        })),
        ownedTickets: await ticketData.getMultiple(user.ticketsBeingWorkedOn.map((ticket) => {
          return ticket.toString();
        })),
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
  .post(
    (req, res, next) => {
    if (req.session.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Forbidden - Only admins can edit users"});
    } else {
      req.method = "GET";
      next();
    }
  },
  async (req, res) => {
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
          renderError(res, 403, 'Forbidden');
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
