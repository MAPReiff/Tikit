import {Router} from 'express';
const router = Router();
import {ticketData} from '../data/index.js';
import {userData} from '../data/index.js';
import {commentData} from '../data/index.js';
import { renderError, checkString } from '../helpers.js';

router
  .route('/view/:id')
  .get(async (req, res) => {

    let ticket;
    let comments; 

    try {
      ticket = await ticketData.get(req.params.id); 
      comments = await commentData.getAll(req.params.id,req.session.user._id);
    } catch(e) {
       renderError(res, 404, 'Issue Retrieving ticket');
       return;
    }
  
    try{ 
      res.status(200).render("ticketView", {
        ticketId: ticket._id,
        title: ticket.name,
        user_id: req.session.user._id,
        name: ticket.name,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        created: !ticket.createdOn ? "N/A" : new Date(ticket.createdOn).toLocaleDateString(),
        deadline: !ticket.deadline ? "N/A" : new Date(ticket.deadline).toLocaleDateString(),
        customer: await userData.get(ticket.customerID.toString()),
        owners: await userData.getMultiple(ticket.owners.map((ticket) => {
          return ticket.toString();
        })),
        category: ticket.category,
        tag: ticket.tags,
        comments: comments
      });
    } catch (e) {
      renderError(res, 500, 'Internal Server Error');
    }
    
    //code here for GET
  });



  router
  .route('/editTicket/:id')
  .get(async (req, res) => {

    let ticket;

    let usersAll = await userData.getAll();
    var users = [];
    for(let i = 0; i < usersAll.length; i++){
      if(req.session.user._id !== usersAll[i]._id || req.session.user.role === "admin"){
        users.push({id: usersAll[i]._id,firstName: usersAll[i].firstName, lastName: usersAll[i].lastName});
      }
    }

    try {
      ticket = await ticketData.get(req.params.id);
    } catch(e) {
       renderError(res, 404, 'Issue Retrieving ticket');
    }

    try{ 
      res.status(200).render("editTicket", {
        _id: req.params.id,
        title: ticket.name,
        user_id: req.session.user._id,
        name: ticket.name,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        created: !ticket.createdOn ? "N/A" : new Date(ticket.createdOn).toLocaleDateString(),
        deadline: !ticket.deadline ? "N/A" : new Date(ticket.deadline).toISOString().substring(0, 10),
        customer: await userData.get(ticket.customerID.toString()),
        owners: ticket.owners,
        users: users,
        category: ticket.category,
        role: req.session.user.role,
        tag: ticket.tags
      });
    } catch (e) {
      renderError(res, 500, 'Internal Server Error');
    }
    //code here for GET
  }).post(async (req, res) => {
    let ticket;
    
    let usersAll = await userData.getAll();
    var users = [];
    for(let i = 0; i < usersAll.length; i++){
      if(req.session.user._id !== usersAll[i]._id || req.session.user.role === "admin"){
        users.push({id: usersAll[i]._id,firstName: usersAll[i].firstName, lastName: usersAll[i].lastName});
      }
    }
    

    try {
      ticket = await ticketData.get(req.params.id);
    } catch(e) {
       renderError(res, 404, 'Issue Retrieving ticket');
    }


    try{
      if (
        req.body.hasOwnProperty("ticketName") &&
        req.body.hasOwnProperty("ticketDescription") &&
        req.body.hasOwnProperty("ticketCategory") &&
        req.body.hasOwnProperty("ticketDeadline") &&
        req.body.hasOwnProperty("ticketPriority")
      ){

        let ticketName = checkString(
          req.body["ticketName"],
          "ticket name"
        );
        let ticketDescription = checkString(
          req.body["ticketDescription"],
          "ticket description"
        );
        let ticketCategory = checkString(
          req.body["ticketCategory"],
          "ticket category"
        );
        let ticketPriority = checkString(
          req.body["ticketPriority"],
          "ticket priority"
        );


        if(typeof req.body["ticketOwners"] === 'string'){
          req.body["ticketOwners"] = [req.body["ticketOwners"]];
        }

      
        let editedTicket = await ticketData.update(
          req.session.user._id,
          req.params.id,
          ticketName,
          req.body["ticketStatus"],
          ticketDescription,
          ticketPriority,
          req.body["ticketDeadline"],
          req.body["ticketOwners"],
          ticketCategory,
          req.session.user.role
        );


        if (editedTicket) {
          res.status(200).redirect("/tickets/view/" + editedTicket._id);
        } else {
          throw new Error("unable to edit user");
        }

      }else{
        res.status(400).render("editTicket", { title: "Edit Ticket", error: 'All fields must be filled out', _id: req.params.id, users:users});
      }

  } catch (e) {
    // render form with 400 code
    res.status(400).render("editTicket", { title: "Edit Ticket", error: `${e}`, _id: req.params.id, users:users});
  }

  });


  router
  .route('/makeTicket')
  .get(async (req, res) => {

    let usersAll = await userData.getAll();
    var users = [];
    for(let i = 0; i < usersAll.length; i++){
      if(req.session.user._id !== usersAll[i]._id || req.session.user.role === "admin"){
        users.push({id: usersAll[i]._id,firstName: usersAll[i].firstName, lastName: usersAll[i].lastName});
      }
    }

    try{ 
      res.status(200).render("makeTicket", {
        title: "Create Ticket",
        users: users,
        user_id: req.session.user._id
      });
    } catch (e) {
      renderError(res, 500, 'Internal Server Error');
    }
    
    //code here for POST
  }).post(async (req, res) => {

    let user;
    let users;

    try {
      user = await userData.get(req.session.user._id);
      let usersAll = await userData.getAll();
      users = [];
      for(let i = 0; i < usersAll.length; i++){

        if(req.session.user._id !== usersAll[i]._id || req.session.user.role === "admin"){
          users.push({id: usersAll[i]._id,firstName: usersAll[i].firstName, lastName: usersAll[i].lastName});
        }
      }

    } catch (e) {
      renderError(res, 404, "Issue Retrieving user");
    }



    try{
        if (
          req.body.hasOwnProperty("ticketName") &&
          req.body.hasOwnProperty("ticketDescription") &&
          req.body.hasOwnProperty("ticketCategory") &&
          req.body.hasOwnProperty("ticketDeadline") &&
          req.body.hasOwnProperty("ticketPriority")
        ){

          let ticketName = checkString(
            req.body["ticketName"],
            "ticket name"
          );
          let ticketDescription = checkString(
            req.body["ticketDescription"],
            "ticket description"
          );
          let ticketCategory = checkString(
            req.body["ticketCategory"],
            "ticket category"
          );
          let ticketPriority = checkString(
            req.body["ticketPriority"],
            "ticket priority"
          );

          let ticketOwners;

          if(!req.body["ticketOwners"]){
            ticketOwners = [];
          }else if(typeof req.body["ticketOwners"] === 'string'){
            ticketOwners = [req.body["ticketOwners"]];
          }else{
            ticketOwners = req.body["ticketOwners"];
          }


          let createdTicket = await ticketData.create(
            ticketName,
            ticketDescription,
            "To Do",
            ticketPriority,
            req.body["ticketDeadline"],
            req.session.user._id,
            ticketOwners,
            ticketCategory
          );

          if (createdTicket) {
            res.status(200).redirect("/tickets/view/" + createdTicket._id);
          } else {
            throw new Error("unable to create user");
          }

        }else{
          res.status(400).render("makeTicket", { 
            title: "Create Ticket", 
            user_id: req.session.user._id,
            error: 'All fields must be filled out'});
        }

    } catch (e) {
      // render form with 400 code
      res.status(400).render("makeTicket", { 
        title: "Create Ticket", 
        user_id: req.session.user._id,
        error: `${e}`});
    }

  });





  router
    .route('/calendar')  
    .get(async (req, res) => {
      let tickets;

      try{
        tickets = await ticketData.getAll(req.session.user.role === "admin", req.session.user._id);
      }catch(e) {
        renderError(res, 404, 'Issue Retrieving ticket(s)');
        return;
      }
 
      for(let ticket of tickets){
        ticket.createdOn = !ticket.createdOn ? "N/A" : new Date(ticket.createdOn).toLocaleDateString();
        ticket.deadline = !ticket.deadline ? "N/A" : new Date(ticket.deadline).toLocaleDateString();
      }

      try{ 
        res.status(200).render("calendar", {
          title: "Calendar View",
          user_id: req.session.user._id,
          tickets: tickets
        });
      } catch (e) {
        renderError(res, 500, 'Internal Server Error');
      }
    });


  export default router;