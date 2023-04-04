import * as helpers from "../helpers.js"; 
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const create = async (firstName, 
    lastName,
    username, 
    hashedPassword, 
    email, 
    role, 
    title, 
    createdTickets, 
    ticketsBeingWorkedOn, 
    commentsLeft) => {

}

const getAll = async () => {

}

const get = async (id) => {

}

const remove = async (id) => {

}

const update = async (id,
    firstName, 
    lastName,
    username, 
    hashedPassword, 
    email, 
    role, 
    title, 
    createdTickets, 
    ticketsBeingWorkedOn, 
    commentsLeft) => {

}


export default {create, getAll, get, remove, update}; 