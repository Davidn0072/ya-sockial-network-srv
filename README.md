# Backend - SockNetwork API

## 📋 Overview

A Node.js REST API backend for a social network platform with real-time messaging, AI-powered recommendations, and comprehensive post management.

**Stack:**
- Express.js - REST API framework
- MongoDB - NoSQL database
- Socket.IO - Real-time communication
- JWT - Authentication
- Multer - File uploads
- Bcrypt - Password hashing
- Claude AI - Content recommendations

---

## 📦 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm

---

## 🚀 Installation & Setup

### 1. Navigate to backend directory

```bash
cd backend/V1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and update values:

```bash
# Database
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Authentication
SECRET_KEY=your_jwt_secret_key_min_32_characters

# Server
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# AI Integration (Optional)
AI_GATEWAY_API_KEY=your_anthropic_api_key
```

### 4. Start the server

```bash
node index.js
```

Server runs on `http://localhost:3000`

---

## 🔌 API Endpoints

All endpoints (except `/auth/*`) require JWT token in header:
```
x-access-token: <your_jwt_token>
```

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login (returns JWT token) |
| POST | `/auth/logout` | Logout user |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get all posts (paginated) |
| GET | `/posts/recommended` | Get AI-recommended posts |
| GET | `/posts/user/:userId` | Get posts by user |
| GET | `/posts/:id` | Get specific post |
| POST | `/posts` | Create new post |
| PATCH | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:id` | Get user profile |
| PATCH | `/users/:id` | Update user profile |

### Friends

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/friends/request` | Send friend request |
| GET | `/friends/requests` | Get pending requests |
| GET | `/friends/rejected` | Get rejected requests |
| GET | `/friends/accepted` | Get accepted friends |
| POST | `/friends/accept` | Accept friend request |
| POST | `/friends/reject` | Reject friend request |
| DELETE | `/friends/:id` | Unfriend user |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comments/:postId` | Get post comments |
| POST | `/comments/:postId` | Add comment to post |
| PATCH | `/comments/:id` | Update comment |
| DELETE | `/comments/:id` | Delete comment |

### Likes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/likes/:targetId` | Like/unlike post or comment |
| GET | `/likes/:targetId` | Get likes for target |

### File Uploads

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload file (storage) |
| POST | `/uploadfilesdb` | Save file info to database |

---

## 🔐 Authentication

### Login Example

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "507f1f77bcf86cd799439011",
  "userName": "John Doe"
}
```

### Using Token

Add token to request headers:
```bash
curl http://localhost:3000/posts \
  -H "x-access-token: eyJhbGciOiJIUzI1NiIs..."
```

**Token expires in 1 hour**

---

## 💬 Real-time Chat (Socket.IO)

### Connect to Chat Namespace

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000/chat', {
    auth: { token: 'your_jwt_token' }
});
```

### Public Chat

Broadcast message to all connected users:

```javascript
socket.emit('chat message', { msg: 'Hello everyone!' });

socket.on('chat message', (data) => {
    console.log(`${data.from}: ${data.msg}`);
});
```

### Private Messages

Send message to specific user:

```javascript
// Join private room with user
socket.emit('join private', { 
    targetUserId: '507f1f77bcf86cd799439011',
    targetUserName: 'Jane Doe'
});

// Send private message
socket.emit('private message', { 
    msg: 'Hello Jane!',
    targetUserId: '507f1f77bcf86cd799439011'
});

// Listen for private messages
socket.on('private message', (data) => {
    console.log(`Private from ${data.from}: ${data.msg}`);
});
```

---

## 📁 Project Structure

```
backend/V1/
├── index.js                    # Main server file & Socket.IO setup
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── package.json                # Dependencies
│
├── Config/
│   └── database.js             # MongoDB connection
│
├── Models/                     # Mongoose schemas
│   ├── userModel.js
│   ├── postModel.js
│   ├── commentsModel.js
│   ├── likesModel.js
│   ├── friendModel.js
│   └── dbUploadFilesModel.js
│
├── Services/                   # Business logic & validation
│   ├── authService.js
│   ├── userService.js
│   ├── postService.js
│   ├── commentsService.js
│   ├── likesService.js
│   ├── friendService.js
│   └── postRecommendation.service.js
│
├── Repositories/               # Data access layer
│   ├── userRepo.js
│   ├── postRepo.js
│   ├── commentsRepo.js
│   └── ...
│
├── Routers/                    # API route handlers
│   ├── authRouter.js
│   ├── userRouter.js
│   ├── postRouter.js
│   ├── commentsRouter.js
│   ├── likesRouter.js
│   ├── friendRouter.js
│   └── storageUploadFileRouter.js
│
├── Middlewares/                # Express middlewares
│   ├── verifyTokenMiddleware.js
│   └── storageUploadFileMiddleware.js
│
├── Errors/                     # Custom error handling
│   └── AppError.js
│
├── Utils/                      # Helpers & utilities
│   ├── pagination.js           # Cursor-based pagination
│   └── validators.js           # Input validation
│
└── uploads/                    # File storage directory
```

---

## 🗄️ Database

**MongoDB Collections:**

| Collection | Purpose |
|------------|---------|
| `users` | User accounts & profiles |
| `posts` | Posts with content |
| `comments` | Post comments (supports nesting via parentCommentId) |
| `likes` | Likes/reactions on posts & comments |
| `friends` | Friend requests & relationships |
| `dbUploadFiles` | File metadata & references |

**Indexes:**
- `users`: index on `name`
- `posts`: index on `userId` + `createdAt`
- `comments`: index on `postId` + `parentCommentId` + `createdAt`
- `friends`: composite indexes for efficient queries

---

## 🤖 AI Recommendations

Uses Anthropic Claude API to recommend posts based on user interests.

**How it works:**
1. Fetch user's domain of interests
2. Get all available posts
3. Send to Claude with recommendation prompt
4. Return top 5 relevant post IDs

**Fallback:** Returns empty array on API error (graceful degradation)

---

## 📝 Input Validation

All inputs are validated at the service layer:

**Post Content:**
- Required: must be a string
- Length: 3-1000 characters

**Comment Content:**
- Required: must be a string
- Length: 3-1000 characters

**User Registration:**
- Name: 3-100 characters
- Email: valid email format
- Password: minimum 8 characters

---

## 🔒 Security Features

- **Password Hashing:** bcrypt with 10 rounds
- **JWT Authentication:** Token-based with 1-hour expiration
- **Input Validation:** All user inputs validated before storage
- **Token Verification:** Middleware protects authenticated routes
- **Passwords Not Returned:** User model excludes password from responses

---

## 📤 File Uploads

Two file upload strategies:

1. **Storage Upload** (`/upload`)
   - Files saved to `/uploads` directory
   - Returns file path

2. **Database Upload** (`/uploadfilesdb`)
   - File metadata saved to MongoDB
   - Linked to posts via postId

---

## 🐛 Error Handling

Custom `AppError` class for consistent error responses:

```javascript
throw new AppError("Invalid input", 400);
```

Returns:
```json
{
  "status": 400,
  "message": "Invalid input"
}
```

---

## ⚙️ Configuration

**Environment Variables:**
- `DB_URL` - MongoDB connection string
- `SECRET_KEY` - JWT secret (min 32 chars)
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend origin (for CORS)
- `AI_GATEWAY_API_KEY` - Anthropic API key (optional)

---

## 🚀 Deployment Notes

Before production:
1. Update `FRONTEND_URL` to your domain
2. Set secure `SECRET_KEY`
3. Use MongoDB Atlas (not local)
4. Enable HTTPS
5. Set `NODE_ENV=production`

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [JWT Introduction](https://jwt.io/introduction)

---

## 📧 Support

For issues or questions, contact the development team.
