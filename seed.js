import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import comments from "./data/comments.js";
import tickets from "./data/tickets.js";
import users from "./data/users.js";

const db = await dbConnection();
await db.dropDatabase();

// Make some users

const user1 = await users.create(
  "John",
  "Doe",
  "jdoe",
  "Password!23",
  "Password!23",
  "jdoe@stevens.edu",
  "Admin",
  "IT Director"
);
console.log(`Created user ${user1.username} | ${user1.role} | ${user1.title}`);

const user2 = await users.create(
  "Marcus",
  "Smith",
  "msmith",
  "Password!23",
  "Password!23",
  "msmith@stevens.edu",
  "Admin",
  "IT Helpdesk Technician"
);
console.log(`Created user ${user2.username} | ${user2.role} | ${user2.title}`);

const user3 = await users.create(
  "Alex",
  "Williams",
  "awilliams",
  "Password!23",
  "Password!23",
  "awilliams@stevens.edu",
  "User",
  "Sales Manager"
);
console.log(`Created user ${user3.username} | ${user3.role} | ${user3.title}`);

const user4 = await users.create(
  "Sarah",
  "Brown",
  "sbrown",
  "Password!23",
  "Password!23",
  "sbrown@stevens.edu",
  "User",
  "Accountant"
);
console.log(`Created user ${user4.username} | ${user4.role} | ${user4.title}`);

// Make some tickets

const ticket1 = await tickets.create(
  "Laptop not working",
  "My laptop is not working. I need help! I have a lot of work to do and I need my laptop to do it. Please help me as soon as possible.",
  "In Progress",
  "High",
  Date.now() + 172800000, // two days from now
  user3._id,
  [user2._id],
  "Hardware",
  ["Laptop", "Dell", "Windows"]
);
console.log(
  `Created ticket ${ticket1.title} | ${ticket1.status} | ${ticket1.priority}`
);

const comment1 = await comments.create(
  ticket1._id,
  user2._id,
  "null",
  "Hi Alex, what is the number of your laptop? It should be on the sticker on the bottom of the laptop. Let me know so I can get a replacement device ready for you."
);
console.log(`Created comment by ${user2.username}`);

const comment2 = await comments.create(
  ticket1._id,
  user3._id,
  comment1._id,
  "Hi Marcus, the number is ATL872."
);
console.log(`Created comment by ${user3.username}`);

const comment3 = await comments.create(
  ticket1._id,
  user2._id,
  "null",
  "Hey Alex, I have a replacement laptop ready for you. Please come by the IT department to pick it up. Thanks!"
);
console.log(`Created comment by ${user2.username}`);

const ticket2 = await tickets.create(
  "Can't access my email",
  "I can't access my email. I need to send an important email to a client. Please help me as soon as possible.",
  "To Do",
  "Medium",
  Date.now() + 86400000, // one day from now
  user4._id,
  [user2._id, user1._id],
  "Software",
  ["Email", "Outlook", "Windows"]
);
console.log(
  `Created ticket ${ticket2.title} | ${ticket2.status} | ${ticket2.priority}`
);

const comment4 = await comments.create(
  ticket2._id,
  user1._id,
  "null",
  "Hi Sarah, where in the building are you? I will have Marcus come by to help you."
);
console.log(`Created comment by ${user1.username}`);

const comment5 = await comments.create(
  ticket2._id,
  user4._id,
  comment4._id,
  "I am in the accounting department on the 7th floor. I sit next to the printer."
);
console.log(`Created comment by ${user4.username}`);

const comment6 = await comments.create(
  ticket2._id,
  user2._id,
  "null",
  "Hey Sarah, I stopped by your desk but you were not there. Please give me a call when you are back at 555-555-5555."
);
console.log(`Created comment by ${user2.username}`);

const ticket3 = await tickets.create(
  "Printer not working!!!!!!!",
  "THE PRINTER AT MY DESK IS NOT WORKING!!! I NEED TO PRINT SOMETHING ASAP. PLEASE HELP ME NOW!!!! THIS IS UNACCEPTABLE!!!!",
  "Completed",
  "Low",
  "",
  user3._id,
  [user1._id],
  "Hardware",
  ["Printer", "HP"]
);
console.log(
  `Created ticket ${ticket3.title} | ${ticket3.status} | ${ticket3.priority}`
);

const comment7 = await comments.create(
  ticket3._id,
  user1._id,
  "null",
  "I'm on my way up to your desk now. Hang tight."
);
console.log(`Created comment by ${user1.username}`);

const comment8 = await comments.create(
  ticket3._id,
  user3._id,
  comment7._id,
  "I am extremely displeased with the state of my printer! It's been malfunctioning for days, and I am absolutely livid about it! I demand that someone come and fix this infernal machine immediately! I shouldn't have to put up with this level of frustration and inconvenience. It's outrageous that I have to waste my time and energy dealing with such a simple problem."
);
console.log(`Created comment by ${user3.username}`);

const comment9 = await comments.create(
  ticket3._id,
  user1._id,
  "null",
  "If this were to happen again, please try restarting the printer first as I just showed you. If that doesn't work, please submit a new ticket."
);
console.log(`Created comment by ${user1.username}`);

await closeConnection();
