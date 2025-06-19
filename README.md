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

# ExpensiFy Backend

A robust, production-ready Node.js/Express.js REST API for personal expense management with comprehensive user authentication, file uploads, and advanced analytics.

## 🌟 Features

- **JWT Authentication**: Secure login/logout with access and refresh token mechanism
- **User Management**: Complete user profile management with avatar uploads
- **File Upload**: Multi-storage support (Cloudinary + local fallback) for avatars
- **Expense Management**: Full CRUD operations with category tracking
- **Analytics API**: Daywise expense aggregation for data visualization
- **Data Validation**: Comprehensive input validation and error handling
- **Security**: Password hashing, token refresh, protected routes, and CORS
- **Modular Architecture**: Clean separation of concerns with MVC pattern

## 🔧 Tech Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **Cloudinary**: Cloud-based image storage and manipulation
- **Multer**: Multipart form data handling for file uploads
- **bcryptjs**: Password hashing and verification
- **CORS**: Cross-Origin Resource Sharing support

## 📊 API Endpoints

### Authentication Routes (`/api/v1/users/`)
- `POST /register` - User registration with avatar upload
- `POST /login` - User login with JWT token generation
- `POST /logout` - User logout and token invalidation
- `POST /refresh-token` - Refresh expired access tokens
- `POST /change-password` - Change user password with validation
- `GET /current-user` - Get current authenticated user details
- `PATCH /update-account` - Update user profile information
- `PATCH /avatar` - Update user avatar with file upload

### Expense Routes (`/api/v1/expenses/`)
- `GET /` - Get all expenses for authenticated user
- `POST /` - Create new expense entry
- `GET /:id` - Get specific expense by ID
- `PATCH /:id` - Update existing expense
- `DELETE /:id` - Delete expense entry
- `GET /daywise-expenses` - Get aggregated daywise expense data for analytics

## 🏗️ Project Structure

```
src/
├── controllers/        # Request handlers and business logic
│   ├── user.controllers.js
│   └── expense.controllers.js
├── middlewares/        # Custom middleware functions
│   ├── auth.middlewares.js
│   └── multer.middlewares.js
├── models/            # Database models and schemas
│   ├── user.model.js
│   └── expense.model.js
├── routes/            # API route definitions
│   ├── user.routes.js
│   └── expense.routes.js
├── utils/             # Utility functions and helpers
│   ├── apiError.js
│   ├── apiResponse.js
│   ├── asyncHandler.js
│   └── cloudinary.js
├── db/               # Database connection
│   └── index.js
├── constants.js      # Application constants
├── app.js           # Express app configuration
└── index.js         # Server entry point
```

## 🚀 Prerequisites

- Node.js (version 16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager
- Cloudinary account (optional - has local fallback)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ExpensiFy-Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/expensify
   
   # JWT Configuration
   ACCESS_TOKEN_SECRET=your_super_secret_access_token_key
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key
   REFRESH_TOKEN_EXPIRY=10d
   
   # Cloudinary Configuration (Optional)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The server will start on `http://localhost:8000`

## 📝 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run test suite (if implemented)

## 💾 Data Models

### User Model
```javascript
{
  userName: String (unique, required),
  email: String (unique, required),
  fullName: String (required),
  avatar: String (Cloudinary URL or local path),
  password: String (hashed, required),
  refreshToken: String,
  timestamps: true
}
```

### Expense Model
```javascript
{
  day: String (required),
  time: String (required),
  date: Date (required),
  category: String (required),
  amount: Number (required),
  user: ObjectId (ref: 'User', required),
  timestamps: true
}
```

## 🔐 Authentication Flow

1. **Registration**: User registers with avatar upload → Profile created with hashed password
2. **Login**: User provides credentials → JWT tokens generated and returned
3. **Protected Routes**: Access token validated via middleware
4. **Token Refresh**: When access token expires, refresh token generates new access token
5. **Logout**: Both tokens invalidated and removed from database

## 🛡️ Security Features

- **Password Security**: bcryptjs hashing with salt rounds
- **JWT Implementation**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal mechanism
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive data exposure
- **CORS Configuration**: Controlled cross-origin access
- **File Upload Security**: Validated file types and sizes

## 📈 Analytics Features

### Daywise Expense Aggregation
The `/daywise-expenses` endpoint provides:
- Daily expense totals
- Transaction counts per day
- Category breakdowns
- Date range filtering
- Aggregated statistics for data visualization

## 🔧 Advanced Features

### File Upload System
- **Dual Storage**: Cloudinary (primary) with local storage fallback
- **Image Processing**: Automatic optimization and format conversion
- **Error Handling**: Graceful fallback when cloud storage is unavailable
- **File Validation**: Type and size restrictions for security

### Error Handling
- **Custom Error Classes**: Structured error responses
- **Async Handler**: Centralized error catching for async operations
- **Validation Errors**: Detailed validation error messages
- **HTTP Status Codes**: Proper status code implementation

### Database Operations
- **Mongoose ODM**: Schema validation and middleware
- **Aggregation Pipelines**: Complex data queries for analytics
- **Indexing**: Optimized database queries
- **Relationship Management**: User-expense data relationships

## 🌍 Environment Configuration

### Development
- Detailed error messages
- Request logging
- Auto-restart with nodemon
- Local file storage fallback

### Production
- Optimized error handling
- Security headers
- Environment-based configuration
- Cloud storage integration

## 🚀 Deployment Ready

- Environment variable configuration
- Production error handling
- Scalable architecture
- Docker containerization support
- Cloud deployment ready