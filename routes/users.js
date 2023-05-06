import { Router } from "express";
const router = Router();
import { ticketData } from "../data/index.js";
import { userData } from "../data/index.js";
import { renderError, checkId, checkString } from "../helpers.js";
import xss from 'xss';

router
  .route("/")
  .get(async (req, res) => {
    let users;

    try {
      users = await userData.getAll();
    } catch (e) {
      renderError(res, 404, "Issue Retrieving users");
      return;
    }

    try {
      res.status(200).render("allUsersView", {
        title: "Users View",
        user_id: req.session.user._id,
        users: users,
        query: "",
      });
    } catch (e) {
      renderError(res, 500, "Internal Server Error");
    }
  })
  .post(async (req, res) => {
    let users;
    const { searchUsers } = req.body;
    searchUsers = xss(searchUsers); 

    try {
      users = await userData.search(searchUsers);
    } catch (e) {
      renderError(res, 404, "User(s) not found");
      return;
    }

    try {
      res.status(200).render("allUsersView", {
        title: "Users View",
        user_id: req.session.user._id,
        users: users,
        query: searchUsers,
      });
    } catch (e) {
      renderError(res, 500, "Internal Server Error");
    }
  });

router.route("/view/:id").get(async (req, res) => {
  try {
    let user = await userData.get(req.params.id);
    const name = `${user.firstName} ${user.lastName}`;
    res.status(200).render("userView", {
      title: `View User - ${name}`,
      user_id: user._id,
      id: user._id,
      name: name,
      username: user.username,
      email: user.email,
      role: user.role,
      jobTitle: user.title,
      createdTickets: await ticketData.getMultiple(
        user.createdTickets.map((ticket) => {
          return ticket.toString();
        })
      ),
      ownedTickets: await ticketData.getMultiple(
        user.ticketsBeingWorkedOn.map((ticket) => {
          return ticket.toString();
        })
      ),
      admin: req.session.user.role.toLowerCase() === "admin",
    });
  } catch (e) {
    res.status(404).render("404", {
      title: "404 User not found",
      user_id: req.session.user._id,
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
        return renderError(res, 403, "Forbidden - Only admins can edit users");
      } else {
        req.method = "GET";
        next();
      }
    },
    async (req, res) => {
      let user;
      try {
        user = await userData.get(req.params.id);
      } catch (e) {
        renderError(res, 404, "User not found");
        return;
      }

      try {
        let user = await userData.get(req.params.id);
        let adminUser = req.session.user;
        const name = `${user.firstName} ${user.lastName}`;
        res.status(200).render("userEdit", {
          title: `Edit User - ${name}`,
          user_id: req.session.user._id,
          id: user._id,
          name: name,
          username: user.username,
          email: user.email,
          role: user.role,
          jobTitle: user.title,
          createdTickets: await ticketData.getMultiple(
            user.createdTickets.map((ticket) => {
              return ticket.toString();
            })
          ),
          ownedTickets: await ticketData.getMultiple(
            user.ticketsBeingWorkedOn.map((ticket) => {
              return ticket.toString();
            })
          ),
          adminID: adminUser._id,
        });
      } catch (e) {
        res.status(404).render("404", {
          title: "404 User not found",
          user_id: req.session.user._id,
          msg: "Error 404: User ID Not Found",
        });
      }
    }
  )
  .post(
    (req, res, next) => {
      if (req.session.user.role.toLowerCase() !== "admin") {
        return res
          .status(403)
          .json({ user_id: req.session.user._id, error: "Forbidden - Only admins can edit users" });
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
          req.body.adminIDInput = xss(req.body.adminIDInput); 
          req.body.roleInput = xss(req.body.roleInput); 
          req.body.titleInput = xss(req.body.titleInput); 
          req.body.userIDInput = xss(req.body.userIDInput); 
          
          let adminUser = await userData.get(req.body.adminIDInput);

          if (adminUser.role.toLowerCase() === "admin") {
            // checks for errors
            let userID = checkId(req.body.userIDInput);
            let role = checkString(req.body.roleInput);
            let title = checkString(req.body.titleInput);
            let user = await userData.get(userID);

            await userData.editUserRoleTitle(
              req.body.userIDInput,
              req.session.user._id,
              req.body.roleInput,
              req.body.titleInput
            );
            res.status(200).redirect(`/users/view/${req.body.userIDInput}`);
          } else {
            renderError(res, 403, "Forbidden");
            return;
          }
        }
      } catch (e) {

        res.status(404).render("404", {
          title: "404 User not found",
          user_id: req.session.user._id,
          msg: "Error 404: User ID Not Found",
        });
      }
    }
  );

export default router;
