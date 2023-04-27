import {Router} from 'express';
const router = Router();
import {ticketData} from '../data/index.js';
import {userData} from '../data/index.js'
import { renderError } from '../helpers.js';


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
    const { searchTickets } = req.body;
    let tickets;

    try{
      tickets = await ticketData.search(searchTickets);
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

  export default router;