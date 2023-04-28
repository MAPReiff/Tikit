import {Router} from 'express';
const router = Router();

import {ticketData} from '../data/index.js';
import {userData} from '../data/index.js';
import {commentData} from '../data/index.js';
import * as helpers from "../helpers.js"; 
import { renderError, renderError400 } from '../helpers.js';


router
  .route('/:ticketId')
  /* get all comments under given ticketId*/
  .get(
    (req, res, next) => {
      if (!req.session.user) {
        return res.redirect('/login');
      }
      next();
    },
    async (req, res) => {
    try {
      req.params.ticketId = helpers.checkId(req.params.ticketId, 'ID URL Param');
    } catch (e) {
      renderError400(res, 400, 'Bad Ticket ID given');
    }

    try {
      const curTicket = await ticketData.get(req.params.ticketId);
      const comments = await commentData.getAll(req.params.ticketId,req.session.user._id);
      if (comments.length === 0) throw "No comments found with that ticket id";
      res.status(200).render("commentView", {ticketId: req.params.ticketId} );
    } catch (e) {
      renderError(res, 404, 'Resource not found');
    }

  })
  /*add comment to given ticket, need to pass userId in body as well as content, may be able to change how this works later*/
  .post(async (req, res) => {
    let commentInfo = req.body;
    try {
      req.params.ticketId = helpers.checkId(req.params.ticketId, 'ID URL Param');
      if (!commentInfo || Object.keys(commentInfo).length === 0) throw 'There are no fields in the request body'
      if ( !commentInfo.contentInput) throw 'Not all neccessary fields provided in request body'; 
      commentInfo.contentInput = helpers.checkString(commentInfo.contentInput, 'content');
    } catch (e) {
      renderError400(res, 400, 'Missing request body info');
    }

    try {
      let curTicket = await ticketData.get(req.params.ticketId); 
    } catch (e) { 
      renderError(res, 404, 'Resource not found');
    }

    try {
      const newComment = await commentData.create(req.params.ticketId, req.session.user._id, 0, commentInfo.contentInput);
      let redirectURL = '/tickets/view/' +  req.params.ticketId; 
      res.redirect(redirectURL); 
    } catch (e) {
      res.status(500).json({error: e});
    }
    //code here for POST
  });

  router
  .route('/comment/:commentId')
  //get comment based on commentId
  .get(
    (req, res, next) => {
      if (!req.session.user) {
        return res.redirect('/login');
      }
      next();
    },
    async (req, res) => {
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
      if (curComment.author != req.session.user._id) {
        return res.status(403).render("403", {msg: "Error: Cannot delete other users comments"});
      }
    } catch (e) { 
      return res.status(404).json({error: e});
    }

    try {
      let curComment = await commentData.get(req.params.commentId); 
      let updatedTicket;
      let hasChildren = !curComment.replyingToID;
      updatedTicket = await commentData.remove(req.params.commentId,hasChildren);

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