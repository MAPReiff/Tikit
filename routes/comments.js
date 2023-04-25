import {Router} from 'express';
const router = Router();

import {ticketData} from '../data/index.js';
import {userData} from '../data/index.js';
import {commentData} from '../data/index.js';
import * as helpers from "../helpers.js"; 
import { renderError } from '../helpers.js';


router
  .route('/:ticketId')
  /* get all comments under given ticketId*/
  .get(async (req, res) => {
    try {
      req.params.ticketId = helpers.checkId(req.params.ticketId, 'ID URL Param');
    } catch (e) {
      renderError(res, 400, 'Bad Ticket ID given');
    }

    try {
      const curTicket = await ticketData.get(req.params.ticketId);
      const comments = await commentData.getAll(req.params.ticketId);
      if (comments.length === 0) throw "No comments found with that ticket id"
      res.json(comments);
    } catch (e) {
      renderError(res, 404, 'Bad Ticket ID given');
    }

  })
  /*add comment to given ticket, need to pass userId in body as well as content, may be able to change how this works later*/
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

  router
  .route('/comment/:commentId')
  //get comment based on commentId
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.commentId = helpers.checkId(req.params.commentId, 'ID URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try { 
      const curComment = await commentData.get(req.params.commentId);
      res.json(curComment);
    } catch (e) { 
      return res.status(404).json({error: e});
    }

  })
  .delete(async (req, res) => {
    //code here for DELETE
    try {
      req.params.commentId = helpers.checkId(req.params.commentId, 'ID URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      let curComment = await commentData.get(req.params.commentId); 
    } catch (e) { 
      return res.status(404).json({error: e});
    }

    try {
      let updatedTicket = await commentData.remove(req.params.commentId); 
      updatedTicket._id = updatedTicket._id.toString();
      res.json(updatedTicket);
    } catch (e) { 
      return res.status(404).json({error: e});
    }

  })
  .patch(async (req, res) => {
    try {
      req.params.commentId = helpers.checkId(req.params.commentId, 'ID URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      let curComment = await commentData.get(req.params.commentId); 
    } catch (e) { 
      return res.status(404).json({error: e});
    }

    let content = req.body.content;
    try { 
      content = helpers.checkString(content, "Content")
    } catch (e) { 
      return res.status(400).json({error: e});
    }

    //update the comment and return the new ticket
    try { 
      let updatedTicket = await commentData.update(req.params.commentId, content);
      res.json(updatedTicket);
    } catch (e) { 
      return res.status(404).json({error: e});
    }

  });


  export default router;