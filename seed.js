import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import comments from "./data/comments.js";
import tickets from "./data/tickets.js";
import users from "./data/users.js";

const db = await dbConnection();
await db.dropDatabase();

// Make some users

const admin1 = await users.create(
  "John",
  "Doe",
  "jdoe",
  "Password!23",
  "Password!23",
  "jdoe@stevens.edu",
  "Admin",
  "IT Director"
);
console.log(
  `Created user ${admin1.username} | ${admin1.role} | ${admin1.title}`
);

const admin2 = await users.create(
  "Marcus",
  "Smith",
  "msmith",
  "Password!23",
  "Password!23",
  "msmith@stevens.edu",
  "Admin",
  "IT Helpdesk Technician"
);
console.log(
  `Created user ${admin2.username} | ${admin2.role} | ${admin2.title}`
);

const admin3 = await users.create(
  "Hanna",
  "Wong",
  "hwong",
  "Password!23",
  "Password!23",
  "hwong@stevens.edu",
  "Admin",
  "IT Helpdesk Technician"
);
console.log(
  `Created user ${admin3.username} | ${admin3.role} | ${admin3.title}`
);

const user1 = await users.create(
  "Alex",
  "Williams",
  "awilliams",
  "Password!23",
  "Password!23",
  "awilliams@stevens.edu",
  "User",
  "Sales Manager"
);
console.log(`Created user ${user1.username} | ${user1.role} | ${user1.title}`);

const user2 = await users.create(
  "Sarah",
  "Brown",
  "sbrown",
  "Password!23",
  "Password!23",
  "sbrown@stevens.edu",
  "User",
  "Accountant"
);
console.log(`Created user ${user2.username} | ${user2.role} | ${user2.title}`);

const user3 = await users.create(
  "Jannet",
  "Waterland",
  "jwaterland",
  "Password!23",
  "Password!23",
  "jwaterland@stevens.edu",
  "User",
  "Graphic Designer"
);
console.log(`Created user ${user3.username} | ${user3.role} | ${user3.title}`);

const user4 = await users.create(
  "Clyde",
  "Smith",
  "csmith",
  "Password!23",
  "Password!23",
  "csmith@stevens.edu",
  "User",
  "Graphic Design Intern"
);
console.log(`Created user ${user4.username} | ${user4.role} | ${user4.title}`);

const user5 = await users.create(
  "Jessica",
  "Evans",
  "jevans",
  "Password!23",
  "Password!23",
  "jevans@stevens.edu",
  "User",
  "Marketing Manager"
);
console.log(`Created user ${user5.username} | ${user5.role} | ${user5.title}`);

// Make some tickets

const ticket1 = await tickets.create(
  "Laptop not working",
  "My laptop is not working. I need help! I have a lot of work to do and I need my laptop to do it. Please help me as soon as possible.",
  "In Progress",
  "High",
  Date.now() + 172800000, // two days from now
  user1._id,
  [admin2._id],
  "Service Request",
  "Laptop, Dell, Windows"
);
console.log(
  `Created ticket ${ticket1.name} | ${ticket1.status} | ${ticket1.priority}`
);

const comment1 = await comments.create(
  ticket1._id,
  admin2._id,
  "null",
  `Hi ${user1.firstName}, what is the number of your laptop? It should be on the sticker on the bottom of the laptop. Let me know so I can get a replacement device ready for you.`
);

const comment2 = await comments.create(
  ticket1._id,
  user1._id,
  comment1._id,
  `Hi ${admin2.firstName}, the number is ATL872.`
);

const comment3 = await comments.create(
  ticket1._id,
  admin2._id,
  "null",
  `Hey ${user1.firstName}, I have a replacement laptop ready for you. Please come by the IT department to pick it up. Thanks!`
);

const ticket2 = await tickets.create(
  "Can't access my email",
  "I can't access my email. I need to send an important email to a client. Please help me as soon as possible.",
  "To Do",
  "Normal",
  Date.now() + 86400000, // one day from now
  user2._id,
  [admin2._id, admin1._id],
  "Service Request",
  "Email, Outlook, Windows"
);
console.log(
  `Created ticket ${ticket2.name} | ${ticket2.status} | ${ticket2.priority}`
);

const comment4 = await comments.create(
  ticket2._id,
  admin1._id,
  "null",
  `Hi ${user2.firstName}, where in the building are you? I will have ${admin2.firstName} come by to help you.`
);

const comment5 = await comments.create(
  ticket2._id,
  user2._id,
  comment4._id,
  "I am in the accounting department on the 7th floor. I sit next to the big printer."
);

const comment6 = await comments.create(
  ticket2._id,
  admin2._id,
  "null",
  `Hey ${user2.firstName}, I stopped by your desk but you were not there. Please give me a call when you are back at 555-555-5555.`
);

const ticket3 = await tickets.create(
  "Printer not working!!!!!!!",
  "THE PRINTER AT MY DESK IS NOT WORKING!!! I NEED TO PRINT SOMETHING ASAP. PLEASE HELP ME NOW!!!! THIS IS UNACCEPTABLE!!!!",
  "Completed",
  "Low", // in this case, an admin changed it to low priority after the ticket was created as critical by the entitled user
  "",
  user1._id,
  [admin1._id],
  "Service Request",
  "Printer, HP"
);
console.log(
  `Created ticket ${ticket3.name} | ${ticket3.status} | ${ticket3.priority}`
);

const comment7 = await comments.create(
  ticket3._id,
  admin1._id,
  "null",
  "I'm on my way up to your desk now. Hang tight."
);

const comment8 = await comments.create(
  ticket3._id,
  user1._id,
  comment7._id,
  "I am extremely displeased with the state of my printer! It's been malfunctioning for days, and I am absolutely livid about it! I demand that someone come and fix this immediately!! I shouldn't have to put up with this level of frustration and inconvenience. It is outrageous that I must waste my time dealing with this issue."
);

const comment9 = await comments.create(
  ticket3._id,
  admin1._id,
  "null",
  "If this were to happen again, please try restarting the printer first as I just showed you. If that doesn't work, please submit a new ticket."
);

const ticket4 = await tickets.create(
  "Photoshop not allowing me to save as gif",
  "I am unable to save my file as a gif in Photoshop! I am getting a disk permission error. Please help me as soon as you can.",
  "In Progress",
  "Normal",
  Date.now() + 345600000, // four days from now
  user4._id,
  [admin3._id],
  "Incident",
  "Photoshop, Adobe, MacOS"
);
console.log(
  `Created ticket ${ticket4.name} | ${ticket4.status} | ${ticket4.priority}`
);

const comment10 = await comments.create(
  ticket4._id,
  admin3._id,
  "null",
  `Hi ${user4.firstName}, let me know when you are available so I can remote into your computer and take a look.`
);

const comment11 = await comments.create(
  ticket4._id,
  user4._id,
  comment10._id,
  `I am available now ${admin3.firstName}.`
);

const comment12 = await comments.create(
  ticket4._id,
  admin3._id,
  "null",
  `I was not able to determine the cause of the issue. I have opened a support case with Adobe and will let you know as soon as I hear back.`
);

const ticket5 = await tickets.create(
  "New laptop request",
  "I would like to request a new MacBook Pro. My current unit, ATL293, has been freezing and crashing frequently when I am using Photoshop and Figma.",
  "Completed",
  "Normal",
  "",
  user3._id,
  [admin1._id, admin3._id],
  "Service Request",
  "Laptop, MacBook, MacOS"
);
console.log(
  `Created ticket ${ticket5.name} | ${ticket5.status} | ${ticket5.priority}`
);

const comment13 = await comments.create(
  ticket5._id,
  admin1._id,
  "null",
  `Hi ${user3.firstName}, unfortunately we can not just give you a new laptop without first trying to resolve the issue at hand. I will have ${admin3.firstName} come by to take a look in a few minutes.`
);

const comment14 = await comments.create(
  ticket5._id,
  admin3._id,
  comment13._id,
  `Will do ${admin1.firstName}.`
);

const comment15 = await comments.create(
  ticket5._id,
  admin3._id,
  "null",
  `I have inspected ${user3.firstName}'s laptop and determined that all of the ventilation holse are caked with dust! I will take the laptop to the IT department workshop to clean it out.`
);

const comment16 = await comments.create(
  ticket5._id,
  admin1._id,
  comment15._id,
  `Thanks for the update ${admin3.firstName}!`
);

const comment17 = await comments.create(
  ticket5._id,
  user3._id,
  "null",
  `Thank you ${admin3.firstName} and ${admin1.firstName} for your help! When should I come to pick up my laptop ${admin3.firstName}?`
);

const comment18 = await comments.create(
  ticket5._id,
  admin3._id,
  comment17._id,
  `I will let you know when it is ready to be picked up ${user3.firstName}. I have a few other tickets to work on first.`
);

const comment19 = await comments.create(
  ticket5._id,
  admin1._id,
  "null",
  `${user3.firstName} is our lead designer and needs a laptop to work on. Please prioritize this ticket ${admin3.firstName}.`
);

const comment20 = await comments.create(
  ticket5._id,
  admin3._id,
  comment19._id,
  `Will do!`
);

const comment21 = await comments.create(
  ticket5._id,
  admin3._id,
  "null",
  `I have cleaned out the dust and the laptop is working fine now ${user3.firstName}. Please come to the IT department to pick it up.`
);

const comment22 = await comments.create(
  ticket5._id,
  user3._id,
  comment21._id,
  `Great, I'm on my way!`
);

const ticket6 = await tickets.create(
  "Deskchair is broken",
  "My deskchair is broken. The backrest snapped off and I need a new one",
  "Completed",
  "Normal",
  "",
  user2._id,
  [admin2._id],
  "Service Request"
);

console.log(
  `Created ticket ${ticket6.name} | ${ticket6.status} | ${ticket6.priority}`
);

const comment23 = await comments.create(
  ticket6._id,
  admin2._id,
  "null",
  `Hi ${user2.firstName}, please reach out to the facilities department for this request. There is nothing the IT department can do to assist you with this.`
);

await closeConnection();

/*
admin1 - John
admin2 - Marcus
admin3 - Hanna

user1 - Alex
user2 - Sarah
user3 - Jannet
user4 - Clyde (intern)
user5 - Jessica
*/
