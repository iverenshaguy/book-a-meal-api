# Book A Meal API

This serves the Book a Meal client application

## Table of Contents

- [Technologies](#technologies)
- [Features Implemented](#features-implemented)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Development](#development)
  - [Docker](#docker)
  - [Testing](#testing)
- [Limitations](#limitations)
- [Contributing Guide](#contributing-guide)
- [FAQs](#faqs)
- [License](#license)

### Project management

This project is managed in Linear: [Book A Meal API board](https://linear.app/iveren-personal/project/book-a-meal-api-cf1246cb842b/issues?layout=board&ordering=priority&grouping=workflowState&subGrouping=none&showCompletedIssues=all&showSubIssues=true&showTriageIssues=true).

### API Deployment

API is deployed at [https://book-a-meal-prod.herokuapp.com](https://book-a-meal-prod.herokuapp.com)

### Documentation

Documentation is hosted at [https://book-a-meal-prod.herokuapp.com](https://book-a-meal-prod.herokuapp.com)

## Technologies

- [NodeJS](https://nodejs.org/) - Runtime Environment
- [ExpressJs](https://expressjs.com/) - Web Application Framework
- [PostgreSQL](https://www.postgresql.org/) - Object-Relational Database System
- [Sequelize](http://docs.sequelizejs.com/) - Promise-based ORM for Node.js v4 and up

### Supporting Packages

#### Linter

- [ESLint](https://eslint.org/) - Linter Tool

#### Compiler

- [Babel](https://eslint.org/) - Compiler for Next Generation JavaScript

#### Test Tools

- [Jest](https://jestjs.io/) - JavaScript Test Framework
- [Supertest](https://github.com/visionmedia/supertest) - Super-agent driven library for testing node.js HTTP servers

## Features Implemented

### Users (Caterers and Customers)

- Users should be able to signin and signup on the app as either a caterer or a customer

### Caterers

- Caterers should be able to create meals
- Caterers should be able to modify meas
- Caterers should be able to delete meals
- Caterers should be able to setup menu for a particular day
- Caterers should be able to modify menu for a particular day
- Caterers should be able to get a particular order
- Caterers should be able to mark a pending order as delivered
- Caterers should be able to get all their orders on the platform
- Caterers should be able to get all their orders for a specific day
- Caterers should be able to get notifications when their meals are ordered

### Customers

- Customers should be able to make an order
- Customers should be able to modify or cancel an order within 100 seconds of creating it
- Customers should be able to get the menu for the day
- Customers should be able to get a particular order
- Customers should be able to get all their orders on the platform
- Customers should be able to get all their orders for a specific day
- Customers should be able to get notifications when caterers set the menu for the day

## Getting Started

### Installation

- Install [NodeJS](https://nodejs.org/) and [PostgreSQL](https://www.postgresql.org/) on your computer
- Install [Sequelize-CLI](https://www.npmjs.com/package/sequelize-cli) globally
- Clone this repository using `git clone https://github.com/iverenshaguy/book-a-meal.git`
- Use the `.env.example` file to setup your environmental variables and rename the file to `.env`
- Run `yarn install` to install all dependencies
- Run `yarn migrate` to setup your database
- You can optionally run `yarn seed` to use the seed data provided
- Run `yarn build` to build the project
- Run `yarn start` to start the server
- Navigate to [localhost:8000](http://localhost:8000/) in browser to access the application

### Development

You can run `yarn start:dev` in development to use [Nodemon](https://nodemon.io/)

[Nodemon](https://nodemon.io/) watches for file changes and restarts your server.

For a full local environment (Node, DB, HTTPS), you can use `yarn setup:dev`, which installs dependencies, runs migrations, seeds (if needed), runs Docker setup (host + certs), and builds the project.

### Docker

You can run the API (and optional Postgres + Caddy) in Docker for local or staging use. The frontend can talk to the API at **https://api.book-a-meal.local** (or `http://api.book-a-meal.local:8000`).

**Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/). For trusted local HTTPS (no browser warning), [mkcert](https://github.com/FiloSottile/mkcert) is optional (e.g. `brew install mkcert`).

#### One-time setup

Run once (or as part of `yarn setup:dev`):

```bash
yarn docker:setup
```

This will:

- Add `api.book-a-meal.local` to `/etc/hosts` (requires **sudo**)
- Generate HTTPS certs in `docker/certs/` (uses [mkcert](https://github.com/FiloSottile/mkcert) if installed, otherwise a self-signed cert; install mkcert for no browser warning: `brew install mkcert`)

#### Running with Docker

- **Current branch** (API built from your working branch):

  ```bash
  yarn docker:up
  ```

  Starts API (port 8000), Caddy (HTTPS on 443), and Postgres (5432). Use [https://api.book-a-meal.local](https://api.book-a-meal.local).

- **Stable API from `master`** (e.g. while developing the frontend):

  ```bash
  yarn docker:master
  ```

  This checks out `master`, builds and runs the API from that branch, then restores your branch when you stop. It may stash and pop local changes.

#### External database

To use an existing database (e.g. Heroku, RDS), set `DATABASE_URL` in `.env` and run:

```bash
docker-compose run --no-deps --service-ports api
```

#### SSH into the container

For debugging you can SSH into the API container:

```bash
ssh -p 2222 app@localhost
```

Password: `app` (change in production or use key-based auth).

### Testing

#### Prerequisites

- [Postman](https://getpostman.com/) - API Toolchain

#### Test environment file (`.env.test`)

Automated tests load `.env.test` when `NODE_ENV=test`/`e2e`.

- Create a local `.env.test` file at the project root.
- Add test-only database credentials and app secrets there.
- Keep `.env` for development/runtime values.

Minimum required keys:

```env
NODE_ENV=test
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/book_a_meal_test
DB_USERNAME=<user>
DB_PASSWORD=<password>
DB_NAME=book_a_meal_test
DB_HOST=localhost
SECRET=<jwt_secret>
```

Notes:

- `.env.test` is ignored by git.
- If you run Postgres via Docker on host port `5433`, update `DATABASE_URL` accordingly.

#### Testing with Postman

- After installing as shown above
- Navigate to [localhost:8000](http://localhost:8000/) in
  [Postman](https://getpostman.com/) to access the application
- Use the [API Documentation](https://book-a-meal-prod.herokuapp.com) to access the endpoints available

## Using the Live App

The live application is hosted at [https://book-a-meal-prod.herokuapp.com](https://book-a-meal-prod.herokuapp.com).

The Menu for each day varies and must be set by any of the registered caterers.

To test the app on any particular day, you can signin to the app as a caterer using the test details below:

Email: `test@test.com`

Password: `testtesttest`

This will allow you to set a menu for the day if no menu is available.

## Limitations

- Application is not integrated with a payment platform
- Application is not real time
- Orders cannot be filtered by status or date

## Contributing Guide

- Fork the repository
- Make your contributions
- Write Test Cases for your contribution
- Create a pull request against the develop branch

## FAQs

- What language is used to build this application?

  - The application (both frontend and backend) is entirely built with Javascript

- Is this an open-source project?

  - Yes, this is an open-source project.

- Who can contribute ?

  - Anyone can contribute as long as you follow the contribution guide outlined above

- Does the application have an API?

  - Yes, the application has an API with a well documented reference that can be viewed [here](https://book-a-meal-prod.herokuapp.com)

- Is the application licensed ?

  - Yes, the application is licensed under the [MIT license](https://github.com/iverenshaguy/book-a-meal-server/blob/develop/LICENSE)

## License

&copy; Iveren Shaguy

Licensed under the [MIT License](https://github.com/iverenshaguy/book-a-meal-server/blob/develop/LICENSE)
