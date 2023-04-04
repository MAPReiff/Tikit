import * as helpers from "../helpers.js"; 
import {tickets} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';


const create = async (name, 
    description, 
    status,
    priority, 
    createdOn, 
    deadline, 
    customerID, 
    owners,
    tags,
    commments) => {

}

const getAll = async () => {

}

const get = async (id) => {

}

const remove = async (id) => {

}

const update = async (name, 
    description, 
    status,
    priority, 
    createdOn, 
    deadline, 
    customerID, 
    owners,
    tags) => {

}


export default {create, getAll, get, remove, update}; 