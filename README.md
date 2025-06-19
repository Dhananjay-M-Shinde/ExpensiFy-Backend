# ExpensiFy Backend

A robust Node.js/Express.js REST API for personal expense management with user authentication, file uploads, and comprehensive expense tracking.

## Features

- **User Authentication**: JWT-based authentication with access/refresh tokens
- **User Management**: Registration, login, logout, profile management
- **File Upload**: Avatar upload with Cloudinary integration
- **Expense Management**: Full CRUD operations for expenses
- **Data Validation**: Comprehensive input validation and error handling
- **Security**: Password hashing, token refresh, protected routes

## Tech Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Authentication tokens
- **Cloudinary**: Image storage
- **Multer**: File upload middleware
- **bcrypt**: Password hashing

## API Endpoints

### Authentication Routes (`/api/v1/users/`)
- `POST /register` - User registration with avatar upload
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Refresh access token
- `GET /current-user` - Get current user info
- `POST /change-password` - Change password
- `PATCH /update-account` - Update account details
- `PATCH /avatar` - Update user avatar

### Expense Routes (`/api/v1/expenses/`)
- `GET /get-expenses` - Get user expenses (sorted by date)
- `POST /add-expense` - Add new expense
- `PUT /update-expense` - Update existing expense
- `DELETE /delete-expense/:id` - Delete expense

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=8000
   MONGO_URL=mongodb://localhost:27017
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Data Models

### User Model
- `userName`: Unique username
- `email`: User email address
- `fullName`: User's full name
- `avatar`: Profile picture URL (Cloudinary)
- `password`: Hashed password
- `refreshToken`: JWT refresh token

### Expense Model
- `day`: Day of the week
- `time`: Time of expense
- `date`: Date of expense
- `category`: Expense category
- `amount`: Expense amount
- `user`: Reference to User model

## Authentication Flow

1. User registers with avatar upload
2. User logs in and receives access/refresh tokens
3. Access token is used for authenticated requests
4. Refresh token is used to get new access tokens when expired
5. Logout invalidates tokens

## Error Handling

The API uses custom error classes and middleware for consistent error responses:
- `apiError`: Custom error class with status codes
- `apiResponse`: Standardized response format
- `asyncHandler`: Wrapper for async route handlers

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Token refresh mechanism
- Input validation and sanitization
- CORS enabled for cross-origin requests

## Development

- Uses ES6 modules
- Nodemon for development auto-restart
- Modular architecture with clear separation of concerns