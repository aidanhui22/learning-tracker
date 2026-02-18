# Learning Tracker

A full-stack React app that stores what you learned and reinforced today, and what you will learn tomorrow. It displays all past entries and a streak counter for consecutive daily entries.

**[Live Demo →](https://learning-tracker-eta.vercel.app)**

## Why I Built This

I personally struggled with tracking learnings from classes/LeetCode, storing them in physical notes that I'd never read again. Learning Tracker is a simple solution that:
- Has three entries to trigger recall when rereading
- Is simple enough so it doesn't become a chore
- Stores all entries in a database that can be deleted/edited.

## Features

- Create, view, edit and delete daily learning entries
- Auto-expanding text inputs for better UX
- Automatic streak calculation for consecutive days
- User accounts with JWT authentication

## Tech Stack

**Frontend:** React, CSS  
**Backend:** PostgreSQL, Node.js, Express  
**Deployment:** Railway (backend + database), Vercel (frontend)  

## Running Locally

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### Backend Setup
```bash
git clone https://github.com/aidanhui22/learning-tracker.git
cd learning-tracker
cd backend
npm install

# Create .env file with:
# DB_USER=your_user
# DB_HOST=localhost
# DB_NAME=learning_tracker
# DB_PASSWORD=your_password (leave blank if on Mac)
# DB_PORT=5432
# PORT=5001
# ACCESS_TOKEN_SECRET=**Generate in terminal and copy with node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"**

# Create database and run schema
psql -U your_user -d postgresql
CREATE DATABASE learning_tracker;
\q
psql -U YOUR_USER -d learning_tracker -f database.sql

npm start
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file with:
# REACT_APP_API_URL=http://localhost:5001

npm start
```
App will run automatically on your browser when npm start is entered on frontend.

## Future Plans

- CSS improvements to make it not ugly :)

---

Built by [Aidan Hui](https://github.com/aidanhui22) | [LinkedIn](https://www.linkedin.com/in/aidan-hui-87b7721b3/)
