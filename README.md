# Tikit

## Team Members

- Valentina Bustamante
- David Bajollari
- William Kastell
- Mitchell Reiff

## Description

A ticketing system, often used in an IT or support setting, consists of a web interface where end users can submit requests, and support desk associates can categorize, update, and respond to those requests.

## Core Features

- [x] User Accounts

  - [x] End users

  - [x] Those who work on support tickets

- [x] Login Page

  - [x] Users will be welcomed with a login page where they will enter their username and password

- [ ] Landing Page

  - [x] List of open tickets (only the ones opened by the user)

  - [x] Place to make a new ticket - pending error checking

  - [x] Search box to look up tickets by some kind of identifier

- [ ] Tickets

  - [x] Store the “customer” who made the request

  - [x] Allow user to add team members to a ticket to give them access to the ticket

  - [x] A subject/title

  - [x] The request message itself

  - [x] The ticket “owner” who is working on the request

  - [x] Priority of the ticket

  - [x] Status (being worked on, on hold, resolved, etc)

  - [x] Communication log (comments)

- [x] Comment: Allow users to start a thread of comments

## Extra Features

- [x] Ticket due dates and a calendar
- [x] Rich text support
- [x] Image support
- [ ] Private comments not visible to end user accounts

  - [ ] Visibility denotations

- [ ] Add files to tickets
- [ ] Email notifications
- [ ] @ mentions for users

## Running Tikit
In order to run Tikit, please make sure that you have Node.js, npm, and MongoDB installed on your system. Please ensure your MongoDB server is running on the default address and port.
Clone the repository to your local device, either by downloading the repo zip file and extracting it or through the terminal:
```
git@github.com:MAPReiff/Tikit.git
or
https://github.com/MAPReiff/Tikit.git
```

Once you have downloaded the repo, navigate to the directory with your terminal, for example:
```
cd Tikit
```

Next, you will need to install the npm dependencies through the terminal:
```
npm install
```

Following your dependencies, we recomend seeding the database. Please make sure that your local MongoDB server is running on the default address and port:
```
npm run seed
```

You can then start Tikit by running:
```
npm start
```

Navigate to http://localhost:3000/, and you can then either login, or register a new account. There are eight pre made accounts in the seed file, all of which use the same password: `Password!23`.

Admin Accounts:
- `jdoe@stevens.edu`
- `msmith@stevens.edu`
- `hwong@stevens.edu`

Normal User Accounts:
- `awilliams@stevens.edu`
- `sbrown@stevens.edu`
- `jwaterland@stevens.edu`
- `csmith@stevens.edu`
- `jevans@stevens.edu`

If you are creating a new account, it will be made as a normal `user`. If you wish to make this user an `admin`, and existing `admin` must manually edit this user under their profile to assign the higher level of access.
