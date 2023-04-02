import * as helpers from "../helpers.js";
import { tickets } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const create = async (
  name, // string input
  description, // string input
  priority, // dropdown menue to select (probably strings)
  deadline, // optional timestamp
  customerID, // objectID of the account who did the action
  category, // dropdown menu to select (probably strings)
  tags // optional array of tags
) => {
  // validate name
  name = helpers.checkString(name, "Name");

  // validate description
  description = helpers.checkString(description, "Description");

  // validate priority
  priority = helpers.checkString(priority, "Priority");
  if (
    priority != "Low" ||
    priority != "Medium" ||
    priority != "High" ||
    priority != "Critical"
  ) {
    throw new Error("priority must be Low, Medium, High, or Critical");
  }

  let createdOn = Date.now();

  // check if dadline is provided
  // deadline expected like this - timestamp
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
  if (!deadline) {
    deadline = NaN;
    // no deadline so we just use NaN as a placeholder
  } else {
    // a dealine was provided
    if (new Date(deadline).getTime() === NaN) {
      throw new Error("provided dealine is not a valid timestamp");
    } else if (new Date(deadline).getTime() < createdOn) {
      throw new Error("provided dealine in the past");
    }
  }

  // validate customerID
  customerID = helpers.checkId(customerID, "Customer ID");

  // validate category
  category = helpers.checkString(category, "Category");

  // check if tags are provided
  if (!tags) {
    tags = [];
  } else {
    tags = helpers.checkStringArray(tags, "Tags");
  }

  // now the db part
};

const getAll = async () => {};

const get = async () => {};

const remove = async () => {};

const update = async () => {};

export default { create, getAll, get, remove, update };
