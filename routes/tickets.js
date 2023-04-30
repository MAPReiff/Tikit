import {Router} from 'express';
const router = Router();
import {ticketData} from '../data/index.js';
import {userData} from '../data/index.js';
import {commentData} from '../data/index.js';
import { renderError } from '../helpers.js';


router
  .route('/')
  .get(async (req, res) => {
    let tickets;
    try{
      tickets = await ticketData.getAll();
    }catch(e) {
      renderError(res, 404, 'Issue Retrieving tickets');
      return;
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
    let { searchTickets } = req.body;
    let tickets;

    try{

      if(!searchTickets){
        searchTickets = req.body.search;
      }
      
      tickets = await ticketData.search(searchTickets);

      for(let ticket of tickets){
        ticket.createdOn = !ticket.createdOn ? "N/A" : new Date(ticket.createdOn).toLocaleDateString();
        ticket.deadline = !ticket.deadline ? "N/A" : new Date(ticket.deadline).toLocaleDateString();
      }


    }catch(e) {
      console.log(e);
      renderError(res, 404, 'Issue Retrieving ticket(s)');
      return;
    }

    try {
      res.status(200).render("allTicketsView", {
        title: "Tickets View",
        tickets: tickets,
        query: searchTickets
      });
    }catch(e) {
      renderError(res, 500, 'Internal Server Error');
    }
  });

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
        tag: ticket.tags,
        comments: comments
      });
    } catch (e) {
      renderError(res, 500, 'Internal Server Error');
    }
    
    //code here for GET
  });

  router
    .route('/calendar')  
    .get(async (req, res) => {
      let tickets;

      try{
        tickets = await ticketData.getAll();
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
          tickets: tickets
        });
      } catch (e) {
        renderError(res, 500, 'Internal Server Error');
      }
    });

  export default router;