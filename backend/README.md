# NovaLibrary Backend API

Professional backend system for NovaLibrary - a modern library management application.

## 🚀 Features

- ✅ **User Authentication** - Secure register/login with JWT
- 🔐 **Password Security** - Bcrypt hashing with salt rounds
- 🎫 **Token Management** - Access & refresh token system
- ✨ **Input Validation** - Zod schema validation
- 🛡️ **Security** - Helmet, CORS, rate limiting
- 📊 **LowDB Storage** - File-based JSON database
- 🎯 **Clean Architecture** - Modular, well-documented code

## 📦 Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** LowDB (JSON)
- **Authentication:** JWT + bcryptjs
- **Validation:** Zod
- **Security:** helmet, cors, express-rate-limit

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── app.js                 # Main application entry
│   ├── seed.js                # Database seeding script
│   ├── config/
│   │   └── db.js              # LowDB configuration
│   ├── utils/
│   │   ├── hash.js            # Password hashing
│   │   └── jwt.js             # JWT token utilities
│   ├── middlewares/
│   │   ├── auth.js            # Authentication middleware
│   │   └── error.js           # Error handling
│   ├── schemas/
│   │   └── auth.schema.js     # Zod validation schemas
│   ├── controllers/
│   │   └── auth.controller.js # Auth business logic
│   └── routes/
│       └── auth.routes.js     # API route definitions
├── db/
│   └── db.json                # Database file
├── package.json
├── .env.example
└── README.md
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update the JWT secrets:

```env
PORT=4000
CORS_ORIGIN=http://localhost:5173
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

### 3. Seed Database

```bash
npm run seed
```

This creates demo users:
- **Admin:** admin@lib.com / 123456
- **Librarian:** staff@lib.com / 123456
- **Reader:** reader@lib.com / 123456

### 4. Start Server

```bash
npm run dev
```

Server runs on: **http://localhost:4000**

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "reader",
    "createdAt": "..."
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@lib.com",
  "password": "123456"
}
```

### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <accessToken>
```

### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}
```

### Logout
```http
POST /api/v1/auth/logout
Content-Type: application/json

{
  "refreshToken": "..."
}
```

### Wishlist (auth required)

Base: `/api/v1/wishlist`

```http
GET /
Authorization: Bearer <accessToken>

200 { "items": ["bookId1","bookId2"] }

POST /add
Content-Type: application/json
Authorization: Bearer <accessToken>
{ "bookId": "b123" }

POST /remove
Content-Type: application/json
Authorization: Bearer <accessToken>
{ "bookId": "b123" }

POST /toggle (optional convenience)
Content-Type: application/json
Authorization: Bearer <accessToken>
{ "bookId": "b123" }
```

Validation errors return 400 with Zod issues. Unauthenticated calls return 401.

### Cart (auth required)

Base: `/api/v1/cart`

```http
GET /
Authorization: Bearer <accessToken>

200 { "items": [ { "bookId": "b1", "qty": 2 } ] }

POST /add
Content-Type: application/json
Authorization: Bearer <accessToken>
{ "bookId": "b1", "qty": 1 }

POST /update
Content-Type: application/json
Authorization: Bearer <accessToken>
{ "bookId": "b1", "qty": 3 }

POST /remove
Content-Type: application/json
Authorization: Bearer <accessToken>
{ "bookId": "b1" }

POST /clear
Authorization: Bearer <accessToken>
```

Notes:
- Wishlist maintains unique book IDs.
- Cart aggregates qty; qty is always >= 1.
- Data persists in `db/db.json` across restarts.

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lib.com","password":"123456"}'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔒 Security Features

- **Password Hashing:** bcrypt with 10 salt rounds
- **JWT Tokens:** Separate access (15min) and refresh (7d) tokens
- **Rate Limiting:** Max 100 requests per 15 minutes
- **Helmet:** Security headers
- **CORS:** Configured for frontend origin
- **Input Validation:** Zod schema validation
- **Error Handling:** Centralized error middleware

## 📚 User Roles

- **admin** - Full system access
- **librarian** - Staff-level permissions
- **reader** - Standard user permissions

## 🎓 Presentation Tips

1. **Demo Flow:**
   - Show health check endpoint
   - Register a new user
   - Login with credentials
   - Get profile with token
   - Refresh token
   - Logout

2. **Code Highlights:**
   - Clean folder structure
   - Well-commented code
   - Error handling
   - Security best practices
   - Token management

3. **Technical Points:**
   - JWT authentication flow
   - Password security (bcrypt)
   - LowDB simplicity (no DB setup)
   - Validation with Zod
   - Express middleware pattern
  - Per-user Wishlist & Cart with LowDB

## 🚀 Production Checklist

- [ ] Change JWT secrets in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Review rate limiting settings
- [ ] Configure CORS for production domain
- [ ] Add logging service (Winston, Pino)
- [ ] Set up monitoring (PM2, Forever)
- [ ] Add request/response logging
- [ ] Implement refresh token rotation
- [ ] Add email verification
- [ ] Set up SSL/TLS

## 📝 License

MIT License - NovaLibrary Team ©2025

---

**Built with ❤️ for educational purposes**
