import {Router} from 'express';
const router = Router();
import {ticketData} from '../data/index.js';
import {userData} from '../data/index.js'
import * as helpers from "../helpers.js"; 


router
  .route('/')
  .get(async (req, res) => {
    try{
      let tickets = await ticketData.getAll();

      for(let ticket of tickets){
        ticket.createdOn = !ticket.createdOn ? "N/A" : new Date(ticket.createdOn).toLocaleDateString();
        ticket.deadline = !ticket.deadline ? "N/A" : new Date(ticket.deadline).toLocaleDateString();
      }

      res.status(200).render("allTicketsView", {
        title: "Tickets View",
        tickets: tickets,
        query: ""
      });

    }catch(e) {
      res.status(404).render("404", {
        title: "404 Tickets not found",
        msg: "Error 404: Issue Retrieving tickets"});
    }
    //code here for GET
  })
  .post(async (req, res) => {
    //code here for POST
    const { search } = req.body;
    let tickets = await ticketData.search(search);

    for(let ticket of tickets){
      ticket.createdOn = !ticket.createdOn ? "N/A" : new Date(ticket.createdOn).toLocaleDateString();
      ticket.deadline = !ticket.deadline ? "N/A" : new Date(ticket.deadline).toLocaleDateString();
    }

    res.status(200).render("allTicketsView", {
      title: "Tickets View",
      tickets: tickets,
      query: search
    });
  });

router
  .route('/view/:id')
  .get(async (req, res) => {
    try {
      let ticket = await ticketData.get(req.params.id);
      res.status(200).render("ticketView", {
        title: ticket.name,
        name: ticket.name,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        created: !ticket.createdOn ? "N/A" : new Date(ticket.createdOn).toLocaleDateString(),
        deadline: !ticket.deadline ? "N/A" : new Date(ticket.deadline).toLocaleDateString(),
        customer: await userData.get(ticket.customerID),
        owner: await userData.getMultiple(ticket.owners),
        category: ticket.category,
        tag: ticket.tags
      });
    } catch (e) {
      console.log(e);
      res.status(404).render("404", {
        title: "404 Ticket not found",
        msg: "Error 404: Ticket ID Not Found"});
    }
    
    //code here for GET
  });

  export default router;