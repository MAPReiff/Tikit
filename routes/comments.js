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

  export default router;