# Task Manager Application

A full-stack task management application built with React and Node.js, featuring role-based access control, real-time dashboards, and Excel report generation.

## Features

### Admin Features
- **Dashboard Analytics**: View comprehensive task statistics and charts
- **Task Management**: Create, update, delete, and assign tasks
- **User Management**: Manage team members and their roles
- **Excel Reports**: Export tasks and user data to Excel files
- **File Uploads**: Upload and manage task attachments

### User Features
- **Personal Dashboard**: View assigned tasks and personal statistics
- **Task Tracking**: Update task status and manage todo checklists
- **Task Details**: View detailed task information and progress
- **Profile Management**: Update personal profile and settings

### Authentication & Security
- JWT-based authentication
- Role-based access control (Admin/Member)
- Protected routes and API endpoints
- Secure file upload handling

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **ExcelJS** for report generation
- **bcryptjs** for password hashing

### Frontend
- **React 19** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Recharts** for data visualization

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_INVITE_TOKEN=your_admin_invite_token
```

Start the backend server:
```bash
npm start
# or for development
npm run dev
```

### Frontend Setup
```bash
cd frontend/Task-Manager
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks (filtered by role)
- `POST /api/tasks` - Create new task (Admin only)
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)
- `PUT /api/tasks/:id/status` - Update task status
- `PUT /api/tasks/:id/todo` - Update task checklist

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user (Admin only)

### Reports
- `GET /api/reports/export/tasks` - Export tasks to Excel
- `GET /api/reports/export/users` - Export users to Excel

## Project Structure

```
taskmanager/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   └── reportController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── userRoutes.js
│   │   └── reportRoutes.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    └── Task-Manager/
        ├── src/
        │   ├── components/
        │   ├── context/
        │   ├── pages/
        │   ├── routes/
        │   ├── utils/
        │   └── App.jsx
        ├── package.json
        └── vite.config.js
```

## Usage

1. **Admin Setup**: Register the first user with the admin invite token to create an admin account
2. **User Management**: Admins can view and manage all users
3. **Task Creation**: Admins can create tasks and assign them to team members
4. **Task Tracking**: Users can view their assigned tasks and update progress
5. **Reports**: Generate Excel reports for tasks and user data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
