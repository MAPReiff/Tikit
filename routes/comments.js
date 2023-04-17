import {Router} from 'express';
const router = Router();

import {ticketData} from '../data/index.js';
import {userData} from '../data/index.js';
import {commentData} from '../data/index.js';
import * as helpers from "../helpers.js"; 


router
  .route('/:ticketId')
  /* get all comments under given ticketId*/
  .get(async (req, res) => {
    try {
      req.params.ticketId = helpers.checkId(req.params.ticketId, 'ID URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      const curTicket = await ticketData.get(req.params.ticketId); 
    } catch (e) { 
      return res.status(404).json({error: e});
    }

    try {
      const tickets = await ticketData.getAll(req.params.ticketId);
      if (tickets.length === 0) throw "No comments found with that ticket id "
      res.json(tickets);
    } catch (e) {
      res.status(404).json({error: e});
    }

    //code here for GET
  })
  /*add comment to given ticket*/
  .post(async (req, res) => {
    try {
      req.params.ticketId = helpers.checkId(req.params.ticketId, 'ID URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }

    let commentInfo = req.body;
    if (!commentInfo || Object.keys(commentInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }

    if (!commentInfo.userId || !commentInfo.content) {
      return res
        .status(400)
        .json({error: 'Not all neccessary fields provided in request body'});
    }
    try {
      commentInfo.userId = helpers.checkId(commentInfo.userId, 'User ID');
      commentInfo.content = helpers.checkString(commentInfo.content, 'content');
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      let curTicket = await ticketData.get(req.params.ticketId); 
      let curUser = await userData.get(commentInfo.userId); 
    } catch (e) { 
      return res.status(404).json({error: e});
    }

    try {
      const {userId, content} = commentInfo;
      const newComment = await commentData.create(req.params.ticketId, userId, content);
      let updatedTicket = await ticketData.get(req.params.ticketId); 
      res.json(updatedTicket);
    } catch (e) {
      res.status(500).json({error: e});
    }
    //code here for POST
   
  });

  export default router;