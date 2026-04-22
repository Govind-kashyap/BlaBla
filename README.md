# BlaBla Ride Sharing Project

This project is a full-stack ride-sharing application built with:

- React + Vite for the frontend
- Express + MongoDB for the backend
- Session-based authentication with cookies
- Nodemailer for password reset and booking notification emails
- Multer for profile image uploads

The codebase is split into two main apps:

- `Blabla` - frontend client
- `Blabla_backend` - backend API server

## Features

- User registration and login
- Session-based authentication
- Forgot password and reset password flow
- Create, update, and delete rides
- Search rides by source, destination, date, and passenger count
- Book a ride
- View personal bookings
- View rides created by the logged-in user
- Manage booking requests as a ride owner
- Upload and update profile image
- Update profile details

## Project Structure

```text
Project/
|-- Blabla/                  # React frontend
|   |-- public/
|   |-- src/
|   |   |-- API/
|   |   |-- Component/
|   |   |-- Pages/
|   |   |-- utlis/
|   `-- vite.config.js
|-- Blabla_backend/          # Express backend
|   |-- config/
|   |-- controller/
|   |-- Middleware/
|   |-- models/
|   |-- router/
|   |-- uploads/
|   `-- server.js
`-- package.json
```

## Frontend

The frontend lives in `Blabla` and uses:

- `react`
- `react-router-dom`
- `axios`
- `antd`
- `tailwindcss`
- `vite`

Main frontend routes found in the app:

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password/:token`
- `/`
- `/home`
- `/addRide`
- `/ride/:id`
- `/Myprofile`
- `/bookings`

## Backend

The backend lives in `Blabla_backend` and uses:

- `express`
- `express-session`
- `mongoose`
- `cookie-parser`
- `cors`
- `bcryptjs`
- `nodemailer`
- `multer`

The server:

- connects to MongoDB using `MONGO_URL`
- runs on `PORT` or `5000`
- enables CORS for `http://localhost:5173`
- serves uploaded files from `/uploads`
- mounts API routes under `/api/user`

## Main API Endpoints

Authentication and profile:

- `POST /api/user/register`
- `POST /api/user/login`
- `POST /api/user/logout`
- `GET /api/user/me`
- `PUT /api/user/update-profile`
- `POST /api/user/upload-profile`
- `POST /api/user/forgot-password`
- `POST /api/user/reset-password/:token`

Ride management:

- `POST /api/user/addRide`
- `PUT /api/user/ride/:id`
- `DELETE /api/user/ride/:id`
- `GET /api/user/my-rides`
- `GET /api/user/search-rides`
- `GET /api/user/ride/:id`

Booking:

- `POST /api/user/book-ride/:id`
- `GET /api/user/my-bookings`
- `GET /api/user/driver-bookings`
- `PUT /api/user/booking/:bookingId`

## Environment Variables

Create a `.env` file in each app as needed.

### Frontend: `Blabla/.env`

```env
VITE_API_URL=http://localhost:5000
```

### Backend: `Blabla_backend/.env`

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/blabla
EMAIL=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Notes:

- The backend uses Gmail SMTP for emails.
- Use a Gmail app password, not your normal account password.
- Replace any existing real credentials before sharing or pushing this project.

## Installation

The archive currently includes `node_modules`, but a clean setup should still use fresh installs.

### 1. Install frontend dependencies

```bash
cd Blabla
npm install
```

### 2. Install backend dependencies

```bash
cd ../Blabla_backend
npm install
```

## Running the Project

Open two terminals.

### Terminal 1: start backend

```bash
cd Blabla_backend
node server.js
```

If you want auto-reload during development, you can use:

```bash
npx nodemon server.js
```

### Terminal 2: start frontend

```bash
cd Blabla
npm run dev
```

Then open:

```text
http://localhost:5173
```

## How the App Works

### User flow

1. A user registers or logs in.
2. The backend stores the session using `express-session`.
3. Authenticated users can create rides, search available rides, and send booking requests.
4. Ride owners can view requests and approve or reject them.
5. Users can manage their profile and upload a profile picture.
6. Password reset emails are sent through Nodemailer.

### Ride data model

Each ride contains:

- source location with name and coordinates
- destination location with name and coordinates
- date
- departure time
- price
- total seats
- available seats
- owner reference

### Booking data model

Each booking contains:

- user reference
- ride reference
- status: `pending`, `approved`, or `rejected`
- created date

## Important Notes

- Authentication is session and cookie based, so frontend requests must send credentials.
- The backend CORS configuration is currently tied to `http://localhost:5173`.
- Uploaded images are stored in `Blabla_backend/uploads`.
- No test suite is configured right now.
- The backend does not currently define a dedicated `npm start` or `npm dev` script.

## Suggested Improvements

- Add proper backend scripts such as `start` and `dev`
- Add validation for request payloads
- Move secrets to safe local environment files only
- Add tests for authentication, rides, and bookings
- Add centralized error handling
- Improve README screenshots and deployment instructions

## Authoring Note

This README was generated by reading the project structure and source files in the provided archive, so it is based on the code that currently exists in the project.
