import {Router} from 'express';
const router = Router();
import {ticketData} from '../data/index.js';
import {userData} from '../data/index.js';
import { renderError } from '../helpers.js';

router
  .route('/')
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

  router
  .route('/view/:id')
  .get(async (req, res) => {

    let user;
    try {
      user = await userData.get(req.params.id);
    }catch(e) {
      renderError(res, 404, 'User not found');
    }

    try {
      const name = `${user.firstName} ${user.lastName}`
      res.status(200).render("userView", {
        title: name,
        name: name,
        username: user.username,
        email: user.email,
        role: user.role,
        title: user.title,
        createdTickets: await ticketData.getMultiple(user.createdTickets),
        ownedTickets: await ticketData.getMultiple(user.ticketsBeingWorkedOn),
        commentsLeft: user.commentsLeft
      });
    } catch (e) {
      renderError(res, 500, 'Internal Server Error');
    }
    
  });

  export default router;