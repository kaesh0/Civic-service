# Civic Issue Reporter Backend API

A production-grade Node.js + Express backend API for the Civic Issue Reporter application with dual database support (MongoDB & PostgreSQL), JWT authentication, AWS S3 file uploads, and comprehensive security features.

## Features

- 🔐 **JWT Authentication** - Access & refresh tokens with secure cookie handling
- 👤 **User Management** - Registration, login, profile management
- 📝 **Report System** - Create, read, update, delete civic issue reports
- 📍 **Geolocation** - GeoJSON Point support for precise location tracking
- 📸 **File Uploads** - AWS S3 integration for photo uploads
- 👍 **Upvote System** - Users can upvote/unvote reports
- 🗄️ **Dual Database** - MongoDB (Mongoose) & PostgreSQL (Sequelize) support
- 🛡️ **Security** - Helmet, CORS, rate limiting, input validation
- 📊 **Pagination** - Efficient pagination and sorting
- 🔍 **Filtering** - Filter reports by status and other criteria
- ✅ **Validation** - Comprehensive input validation with express-validator
- 📚 **Documentation** - Complete API documentation and JSDoc comments

## Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Databases**: MongoDB (Mongoose) / PostgreSQL (Sequelize)
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: AWS S3 (@aws-sdk/client-s3)
- **Security**: bcryptjs, helmet, express-rate-limit, cors
- **Validation**: express-validator
- **File Upload**: multer
- **Environment**: dotenv

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB OR PostgreSQL database
- AWS S3 bucket for file storage

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Configure the following variables in `.env`:
     ```env
     # Server
     PORT=5000
     NODE_ENV=development
     
     # Database (choose one)
     DATABASE_TYPE=mongodb
     MONGO_URI=mongodb://localhost:27017/civic-reporter
     # OR
     # DATABASE_TYPE=postgresql
     # POSTGRES_URI=postgresql://username:password@localhost:5432/civic_reporter
     
     # JWT
     JWT_SECRET=your-super-secret-jwt-key
     JWT_REFRESH_SECRET=your-super-secret-refresh-key
     
     # AWS S3
     AWS_BUCKET_NAME=your-s3-bucket
     AWS_REGION=us-east-1
     AWS_ACCESS_KEY_ID=your-access-key
     AWS_SECRET_ACCESS_KEY=your-secret-key
     ```

4. **Set up your database:**
   
   **For MongoDB:**
   - Install and start MongoDB
   - The application will automatically create collections
   
   **For PostgreSQL:**
   - Install and start PostgreSQL
   - Create a database named `civic_reporter`
   - The application will automatically create tables in development mode

5. **Set up AWS S3:**
   - Create an S3 bucket
   - Configure bucket permissions for public read access
   - Create IAM user with S3 permissions
   - Add credentials to `.env` file

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` by default.

## API Documentation

Base URL: `http://localhost:5000/api/v1`

### Authentication

| Endpoint | Method | Auth | Description | Body | Response |
|----------|--------|------|-------------|------|----------|
| `/auth/signup` | POST | No | Register new user | `username, email, password` | 201: User created |
| `/auth/login` | POST | No | User login | `email, password` | 200: Login success |
| `/auth/refresh` | POST | Refresh Token | Refresh access token | N/A | 200: New access token |
| `/auth/logout` | POST | Yes | Logout user | N/A | 204: Logout success |
| `/auth/profile` | GET | Yes | Get user profile | N/A | 200: User profile |

### Reports

| Endpoint | Method | Auth | Description | Body | Response |
|----------|--------|------|-------------|------|----------|
| `/reports` | GET | No | Get all reports | Query: `page, limit, sortBy, status` | 200: Reports list |
| `/reports` | POST | Yes | Create new report | `title, description, location, photo` | 201: Report created |
| `/reports/:id` | GET | No | Get report by ID | N/A | 200: Report details |
| `/reports/:id` | PATCH | Yes (Owner) | Update report | `title, description, status` | 200: Report updated |
| `/reports/:id` | DELETE | Yes (Owner) | Delete report | N/A | 204: Report deleted |
| `/reports/:id/upvote` | POST | Yes | Toggle upvote | N/A | 200: Upvote toggled |

### Health Check
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/health` | GET | No | Server health status |

## Request/Response Examples

### User Registration
```bash
POST /api/v1/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (201):
{
  "success": true,
  "message": "User account created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "accessToken": "jwt-token"
  }
}
```

### User Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Create Report
```bash
POST /api/v1/reports
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

title=Pothole on Main Street
description=Large pothole causing traffic issues
location={"type":"Point","coordinates":[-74.006,40.7128]}
photo=<file>
```

### Get Reports with Pagination
```bash
GET /api/v1/reports?page=1&limit=20&sortBy=createdAt&sortOrder=desc&status=Open
```

## Database Models

### User Model
```javascript
{
  id: UUID/ObjectId,
  username: String (unique, 3-30 chars),
  email: String (unique, valid email),
  password: String (hashed, min 6 chars),
  createdAt: Date,
  updatedAt: Date
}
```

### Report Model
```javascript
{
  id: UUID/ObjectId,
  title: String (5-200 chars),
  description: String (10-2000 chars),
  location: GeoJSON Point,
  photoUrl: String (optional),
  status: Enum ['Open', 'In Progress', 'Resolved', 'Closed'],
  upvoteCount: Number (default: 0),
  author: Reference to User,
  createdAt: Date,
  updatedAt: Date
}
```

### Upvote Model
```javascript
{
  id: UUID/ObjectId,
  user: Reference to User,
  report: Reference to Report,
  createdAt: Date
}
```

## Security Features

- **JWT Authentication**: Secure access & refresh token system
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 
  - Auth endpoints: 5 requests/minute
  - Other endpoints: 100 requests/15 minutes
- **Input Validation**: Comprehensive validation with express-validator
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers
- **File Upload Security**: Type and size validation
- **Owner Authorization**: Users can only modify their own reports

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ], // Optional validation errors
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `DATABASE_TYPE` | Database type (mongodb/postgresql) | Yes | mongodb |
| `MONGO_URI` | MongoDB connection string | If using MongoDB | - |
| `POSTGRES_URI` | PostgreSQL connection string | If using PostgreSQL | - |
| `JWT_SECRET` | JWT secret key | Yes | - |
| `JWT_REFRESH_SECRET` | JWT refresh secret key | Yes | - |
| `JWT_ACCESS_TOKEN_EXPIRATION` | Access token expiry | No | 15m |
| `JWT_REFRESH_TOKEN_EXPIRATION` | Refresh token expiry | No | 7d |
| `AWS_BUCKET_NAME` | S3 bucket name | Yes | - |
| `AWS_REGION` | AWS region | Yes | - |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:3000 |

## Deployment

### Heroku
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect your repository
4. Deploy

### AWS/Docker
1. Build Docker image
2. Push to container registry
3. Deploy to ECS/EKS
4. Configure load balancer and environment variables

### Environment Setup
- Set `NODE_ENV=production`
- Use secure JWT secrets
- Configure production database
- Set up S3 bucket with proper permissions
- Enable HTTPS

## Development

### Project Structure
```
backend/
├── config/         # Database connections
├── controllers/    # Request handlers
├── middleware/     # Auth, validation, error handling
├── models/         # Database models (Mongoose/Sequelize)
├── routes/         # API routes
├── services/       # Business logic (S3, Auth)
├── utils/          # Helper functions and constants
├── app.js          # Express app setup
└── package.json
```

### Adding New Features
1. Create model in `models/`
2. Add controller in `controllers/`
3. Create routes in `routes/`
4. Add validation in `middleware/validation.js`
5. Update documentation

## Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## License

MIT License

## Support

For issues and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error messages and logs

---

**Note**: This is a production-ready backend with comprehensive security features. Make sure to properly configure all environment variables and security settings before deploying to production.