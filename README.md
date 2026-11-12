# HR Management System

A MERN Stack based HR Management System designed to manage employee information, attendance, leave requests, and salary records.

## Technologies Used

- MongoDB
- Express.js
- React.js
- Node.js
- JavaScript
- JWT Authentication
- Bootstrap
- CSS

## Features

### Admin
- Secure Admin Login
- Add, View, Update and Delete Employees
- View Employee Attendance
- Manage Leave Requests
- Approve or Reject Leave Requests
- Add and Manage Employee Salaries
- Update Salary Payment Status

### Employee
- Secure Employee Login
- View Personal Dashboard
- Check In and Check Out
- Apply for Leave
- View Leave Status
- View Personal Salary Details

## Project Structure

- backend – Node.js and Express API
- frontend – React application

## How to Run the Project

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the backend folder and configure:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Do not share or publish your actual credentials.

## Author

MERN Stack Development Project