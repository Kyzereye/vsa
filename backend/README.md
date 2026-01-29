# VSA Backend API

Backend API for Veterans Sportsmens Association.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users (Protected - requires authentication)
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Events
- `GET /api/events` - Get all events (public)
- `GET /api/events/:id` - Get event by ID (public)
- `POST /api/events` - Create event (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)

### Programs
- `GET /api/programs` - Get all programs (public)
- `GET /api/programs/:id` - Get program by ID (public)
- `POST /api/programs` - Create program (protected)
- `PUT /api/programs/:id` - Update program (protected)
- `DELETE /api/programs/:id` - Delete program (protected)

### News
- `GET /api/news` - Get all news (public)
- `GET /api/news/:id` - Get news by ID (public)
- `POST /api/news` - Create news (protected)
- `PUT /api/news/:id` - Update news (protected)
- `DELETE /api/news/:id` - Delete news (protected)

## Authentication

Protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Default Admin Account

Email: `admin@vsa.org`
Password: `admin123`

**Change this in production!**
