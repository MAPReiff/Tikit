import {Router} from 'express';
const router = Router();
import {ticketData} from '../data/index.js';
import * as helpers from "../helpers.js"; 


router
  .route('/')
  .get(async (req, res) => {
    
    //code here for GET
  })
  .post(async (req, res) => {
    //code here for POST
   
  });

router
  .route('/view/:id')
  .get(async (req, res) => {
    try {
      let ticket = await ticketData.get(req.params.id);
      res.json(ticket);
    } catch (e) {
      res.status(404).render("404", {
        title: "404 Ticket not found",
        msg: "Error 404: Ticket ID Not Found"});
    }
    
    //code here for GET
  })

  export default router;