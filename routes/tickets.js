import {Router} from 'express';
const router = Router();
import {ticketData} from '../data/index.js';
import {userData} from '../data/index.js'
import { renderError, checkString } from '../helpers.js';


router
  .route('/')
  .get(async (req, res) => {
    let tickets;
    try{
      tickets = await ticketData.getAll();
    }catch(e) {
      renderError(res, 404, 'Issue Retrieving tickets');
    }

    for(let ticket of tickets){
      ticket.createdOn = !ticket.createdOn ? "N/A" : new Date(ticket.createdOn).toLocaleDateString();
      ticket.deadline = !ticket.deadline ? "N/A" : new Date(ticket.deadline).toLocaleDateString();
    }

    try {
      res.status(200).render("allTicketsView", {
        title: "Tickets View",
        tickets: tickets,
        query: ""
      });
    }catch(e) {
      renderError(res, 500, 'Internal Server Error');
    }
    //code here for GET
  })
  .post(async (req, res) => {
    //code here for POST
    const { search } = req.body;
    let tickets;

    try{
      tickets = await ticketData.search(search);
    }catch(e) {
      renderError(res, 404, 'Issue Retrieving ticket(s)');
    }

    for(let ticket of tickets){
      ticket.createdOn = !ticket.createdOn ? "N/A" : new Date(ticket.createdOn).toLocaleDateString();
      ticket.deadline = !ticket.deadline ? "N/A" : new Date(ticket.deadline).toLocaleDateString();
    }

    try {
      res.status(200).render("allTicketsView", {
        title: "Tickets View",
        tickets: tickets,
        query: search
      });
    }catch(e) {
      renderError(res, 500, 'Internal Server Error');
    }
  });

router
  .route('/view/:id')
  .get(async (req, res) => {

    let ticket;

    try {
      ticket = await ticketData.get(req.params.id);
    } catch(e) {
       renderError(res, 404, 'Issue Retrieving ticket');
    }

    try{ 
      res.status(200).render("ticketView", {
        title: ticket.name,
        name: ticket.name,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        created: !ticket.createdOn ? "N/A" : new Date(ticket.createdOn).toLocaleDateString(),
        deadline: !ticket.deadline ? "N/A" : new Date(ticket.deadline).toLocaleDateString(),
        customer: await userData.get(ticket.customerID.toString()),
        owner: await userData.getMultiple(ticket.owners.map((ticket) => {
          return ticket.toString();
        })),
        category: ticket.category,
        tag: ticket.tags
      });
    } catch (e) {
      renderError(res, 500, 'Internal Server Error');
    }
    
    //code here for GET
  });


  router
  .route('/makeTicket')
  .get(async (req, res) => {
    console.log("IN MAKE TICKET GET")
    try{ 
      res.status(200).render("makeTicket", {
        title: "Create Ticket"
      });
    } catch (e) {
      renderError(res, 500, 'Internal Server Error');
    }
    
    //code here for POST
  }).post(async (req, res) => {
    console.log("IN MAKE TICKET POST")
    let user;

    try {
      user = await userData.get(req.session.user._id);
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
          console.log(ticketName, ticketDescription, ticketCategory, ticketPriority);
        
          let createdTicket = await ticketData.create(
            ticketName,
            ticketDescription,
            "To Do",
            ticketPriority,
            req.body["ticketDeadline"],
            req.session.user._id,
            ['644939d4475bc92a43a50aef'],
            ticketCategory
            //[]
          );

          if (createdTicket) {
            console.log("ticketId",createdTicket._id);
            res.status(200).redirect("/tickets/view/" + createdTicket._id);
          } else {
            throw new Error("unable to create user");
          }

        }else{
          res.status(400).render("makeTicket", { title: "Create Ticket", error: 'All fields must be filled out'});
        }

    } catch (e) {
      // render form with 400 code
      res.status(400).render("makeTicket", { title: "Create Ticket", error: `${e}`});
    }


  });





  export default router;