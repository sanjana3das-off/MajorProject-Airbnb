# Major Project – Airbnb Clone

A simple Airbnb-like web application built with **Node.js**, **Express**, **MongoDB**, and **EJS** templates.
This project allows users to view, create, and review listings with server-side error handling, session management, and a responsive frontend.

---

## Features

* View all listings
* Create, edit, and delete listings
* Add reviews to listings
* Server-side error handling with custom middleware
* EJS templating for dynamic pages
* Layout partials (`navbar`, `footer`) for reusability
* Session management using `express-session`
* Flash messages using `connect-flash`
* Client-side JS and CSS for interactive UI

---

## Technologies Used

* **Node.js** – JavaScript runtime
* **Express** – Web framework
* **MongoDB + Mongoose** – Database & ODM
* **EJS + ejs-mate** – Templating engine
* **express-session** – Session management
* **method-override** – Support PUT and DELETE requests in forms
* **connect-flash** – Flash messages
* **Joi** – Data validation

---

## Folder Structure

```
MajorProject-Airbnb/
├── app.js                   # Main server file
├── index.js                 # Optional entry (if used)
├── classroom/               # Possibly project-related classroom files
├── data.js                  # Sample data or seed data
├── schema.js                # Joi validation schemas
├── models/
│   ├── listing.js           # Mongoose schema for listings
│   └── review.js            # Mongoose schema for reviews
├── routes/
│   ├── listing.js           # Routes for listing CRUD
│   └── review.js            # Routes for listing reviews
├── utils/
│   ├── ExpressError.js      # Custom error class
│   └── wrapAsync.js         # Helper for async error handling
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs  # Main layout template
│   ├── includes/
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   ├── listings/
│   │   ├── edit.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── show.ejs
│   └── error.ejs            # Error page
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── package.json
└── package-lock.json
```

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/sanjana3das/MajorProject-Airbnb.git
cd MajorProject-Airbnb
```

2. Install dependencies:

```bash
npm install
```

3. Ensure **MongoDB** is running locally (default URL: `mongodb://127.0.0.1:27017/wanderlust`).

---

## Usage

1. Start the server:

```bash
node app.js
```

Or if you have **nodemon** installed:

```bash
nodemon app.js
```

2. Open in browser:

```
http://localhost:8080
```

3. Available routes:

* `/` – Home route
* `/listings` – View all listings
* `/listings/new` – Add a new listing
* `/listings/:id` – Show listing details
* `/listings/:id/edit` – Edit a listing
* `/listings/:id/reviews` – Add/view reviews

---

## Error Handling

All invalid routes are handled by custom middleware which renders `error.ejs` with the appropriate error message.
Async route errors are handled using `wrapAsync.js` utility.

---



ISC License
