# Civic Service Backend API

A Node.js + Express backend with Supabase integration for the Civic Service application.

## Features

- 🔐 Authentication (signup/login) using email and password
- 📝 Report creation and management
- 👍 Report vouching (upvoting) system
- 🗄️ Supabase database integration
- 🔒 JWT-based authentication
- ✅ Input validation and sanitization
- 🛡️ Security middleware (helmet, CORS, rate limiting)
- 📊 Comprehensive API endpoints

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

## Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update the following variables in `.env`:
     ```env
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     JWT_SECRET=your_secure_jwt_secret
     ```

4. **Set up Supabase database:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migration files in order:
     1. `supabase/migrations/create_users_table.sql`
     2. `supabase/migrations/create_reports_table.sql`
     3. `supabase/migrations/create_report_vouches_table.sql`

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

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (requires authentication)

### Reports
- `POST /reports/create` - Create new report (requires authentication)
- `PUT /reports/edit/:id` - Edit report description (requires authentication)
- `POST /reports/vouch/:id` - Vouch for a report (requires authentication)
- `GET /reports/list` - Get all reports with optional filters
- `GET /reports/:id` - Get specific report by ID

### Health Check
- `GET /health` - Server health status

## API Request/Response Examples

### User Signup
```bash
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### User Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Create Report
```bash
POST /reports/create
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "Road",
  "priority": "High",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "photo_url": "https://example.com/photo.jpg",
  "anonymous": false
}
```

### Get Reports
```bash
GET /reports/list?page=1&limit=20&category=Road&status=Submitted
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (Text, Not Null)
- `email` (Text, Unique, Not Null)
- `password` (Text, Not Null, Hashed)
- `points` (Integer, Default: 0)
- `badges` (JSONB, Default: [])
- `phone` (Text, Optional)
- `address` (Text, Optional)
- `aadhaar` (Text, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Reports Table
- `id` (UUID, Primary Key)
- `title` (Text, Not Null)
- `description` (Text, Not Null)
- `category` (Text, Not Null)
- `priority` (Text, Not Null) - 'Low', 'Medium', 'High'
- `status` (Text, Default: 'Submitted') - 'Submitted', 'In Progress', 'Resolved', 'Rejected'
- `latitude` (Decimal, Optional)
- `longitude` (Decimal, Optional)
- `manual_location` (JSONB, Optional)
- `photo_url` (Text, Optional)
- `vouch_count` (Integer, Default: 0)
- `anonymous` (Boolean, Default: false)
- `user_id` (UUID, Foreign Key)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Report Vouches Table
- `id` (UUID, Primary Key)
- `report_id` (UUID, Foreign Key)
- `user_id` (UUID, Foreign Key)
- `created_at` (Timestamp)

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configured for frontend domains
- **Helmet**: Security headers
- **Row Level Security**: Supabase RLS policies

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Optional validation errors
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | No (default: 7d) |
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `FRONTEND_URL` | Frontend URL for CORS | No (default: http://localhost:5173) |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License