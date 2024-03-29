import {Router} from 'express';
const router = Router();

import {ticketData} from '../data/index.js';
import {userData} from '../data/index.js';
import {commentData} from '../data/index.js';
import * as helpers from "../helpers.js"; 
import { renderError } from '../helpers.js';
import xss from 'xss';


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
      return res.status(400).json({error: e});
    }

    try {
      const curTicket = await ticketData.get(req.params.ticketId);
      const comments = await commentData.getAll(req.params.ticketId,req.session.user._id);
      if (comments.length === 0) throw "No comments found with that ticket id";
      return res.status(200).json(comments);
    } catch (e) {
      return res.status(404).json({error: e});
    }

  })
  /*add comment to given ticket, need to pass userId in body as well as content, may be able to change how this works later*/
  .post(
    (req, res, next) => {
      if (!req.session.user) {
        return res.redirect('/login');
      }
      next();
    }, 
    async (req, res) => {
    let commentInfo = req.body;
    try {
      req.params.ticketId = helpers.checkId(req.params.ticketId, 'ID URL Param');
      if (!commentInfo || Object.keys(commentInfo).length === 0) throw 'There are no fields in the request body'
      if ( !commentInfo.contentInput || !commentInfo.replyingToID) throw 'Not all neccessary fields provided in request body'; 
      commentInfo.contentInput = helpers.checkString(commentInfo.contentInput, 'content');
      commentInfo.replyingToID = helpers.checkString(commentInfo.replyingToID, 'replying to ID');
      if (commentInfo.replyingToID.toLowerCase() !== "null") { 
        commentInfo.replyingToID = helpers.checkId(commentInfo.replyingToID);
      } 
      commentInfo.replyingToID = xss(commentInfo.replyingToID);
      commentInfo.contentInput = xss( commentInfo.contentInput);
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      let curTicket = await ticketData.get(req.params.ticketId); 
    } catch (e) { 
      return res.status(404).json({error: e});
    }

    try {
      const newComment = await commentData.create(req.params.ticketId, req.session.user._id, commentInfo.replyingToID, commentInfo.contentInput);
      return res.status(200).json(newComment);
    } catch (e) {
      return res.status(500).json({error: e});
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
  .delete(
    (req, res, next) => {
      if (!req.session.user) {
        return res.redirect('/login');
      }
      next();
    },
    async (req, res) => {
    //code here for DELETE

    try {
      req.params.commentId = helpers.checkId(req.params.commentId, 'ID URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      let curComment = await commentData.get(req.params.commentId); 
      if (curComment.author != req.session.user._id) {
        return res.status(403).json( {msg: "Error: Cannot delete other users comments"});
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
      return res.status(200).json(updatedTicket);
    } catch (e) { 
      return res.status(500).json({error: e});
    }

  })
  .patch(
    (req, res, next) => {
      if (!req.session.user) {
        return res.redirect('/login');
      }
      next();
    }, 
    async (req, res) => {
    try {
      req.params.commentId = helpers.checkId(req.params.commentId, 'ID URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      let curComment = await commentData.get(req.params.commentId);
      if (curComment.author != req.session.user._id) {
        return res.status(403).json( {msg: "Error: Cannot delete other users comments"});
      } 
    } catch (e) { 
      return res.status(404).json({error: e});
    }
    try{ 
      if(!req.body.content) throw "Error: Must provide content in request body";
    } catch (e) { 
      return res.status(400).json({error: e});
    }

    let content; 
    try { 
      if(!req.body.content) throw "Error: Must provide content in request body";
      req.body.content = xss(req.body.content);
      content = req.body.content;
      content = helpers.checkString(content, "Content")
    } catch (e) { 
      return res.status(400).json({error: e});
    }

    //update the comment and return the new ticket
    try { 
      let updatedTicket = await commentData.update(req.params.commentId, content);
      return res.status(200).json(updatedTicket);
    } catch (e) { 
      return res.status(500).json({error: e});
    }

  });


  export default router;