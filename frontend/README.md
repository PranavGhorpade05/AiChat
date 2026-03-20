# AI Chat Application

A full-stack AI chat application built with Next.js frontend and FastAPI backend, powered by Google Gemini API for intelligent responses. The application features user authentication via Google OAuth and persistent chat history with PostgreSQL.

## Project Structure

```
├── frontend/          # Next.js React application
├── backend/           # FastAPI Python backend
├── database.sql       # Database initialization script
├── docker-compose.yml # Docker orchestration
└── README.md          # This file
```

## Technology Stack

**Frontend:**
- Next.js 13+ (React Framework)
- Axios (HTTP Client)
- next-auth (Google OAuth Authentication)
- React Markdown (Markdown Message Rendering)
- Material-UI (UI Components)
- CSS Modules (Styling)

**Backend:**
- FastAPI (Python Web Framework)
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- google-generativeai (Gemini API Integration)
- Python 3.9+

**Authentication:**
- Google OAuth 2.0
- next-auth for Next.js

**AI Service:**
- Google Gemini API (gemini-2.5-flash model)

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.9+ (for backend)
- PostgreSQL 12+ (database)
- Docker & Docker Compose (optional, for containerized setup)
- Google OAuth credentials
- Google Gemini API key

## Installation & Setup

### 1. Database Setup

Ensure PostgreSQL is running on your machine.

```bash
# Create database and tables
psql -U postgres -f backend/database.sql
```

Or using Docker:

```bash
docker-compose up -d postgres
docker-compose exec postgres psql -U postgres -f /docker-entrypoint-initdb.d/database.sql
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configure Backend Environment (.env):**

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_chat_db
GOOGLE_GEMINI_API_KEY=your_api_key_here
FASTAPI_ENV=development
```

**Start Backend Server:**

```bash
python main.py
# or with uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

**Configure Frontend Environment (.env.local):**

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Start Frontend Development Server:**

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## API Endpoints

### Chat Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/chats` | Create a new chat session | Yes |
| GET | `/api/chats` | Get all chat sessions for user | Yes |
| GET | `/api/chats/{chat_id}` | Get specific chat with messages | Yes |
| DELETE | `/api/chats/{chat_id}` | Delete a chat session | Yes |
| PUT | `/api/chats/{chat_id}` | Update chat title | Yes |

### Messages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/chats/{chat_id}/messages` | Send message and get AI response | Yes |
| GET | `/api/chats/{chat_id}/messages` | Get all messages in a chat | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check API health status |
| GET | `/` | API root with endpoint info |

### Request Headers

All API requests require the following header:

```
X-User-Email: user@example.com
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Chats Table
```sql
CREATE TABLE chats (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
    id VARCHAR(255) PRIMARY KEY,
    chat_id VARCHAR(255) NOT NULL REFERENCES chats(id),
    role VARCHAR(50),  -- 'user' or 'assistant'
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Configuration

### Environment Variables

**Backend (.env):**
- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_GEMINI_API_KEY`: API key from Google AI Studio
- `FASTAPI_ENV`: Development or production environment

**Frontend (.env.local):**
- `NEXTAUTH_URL`: Application URL
- `NEXTAUTH_SECRET`: Secret key for session encryption
- `GOOGLE_CLIENT_ID`: OAuth Client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: OAuth Client Secret from Google Cloud Console
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

## Getting Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key"
3. Create new API key or use existing one
4. Copy the API key to backend `.env`

## Running with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Features

✅ Google OAuth Authentication
✅ Real-time Chat History
✅ Multi-turn Conversations with Context
✅ Markdown Rendering for Responses
✅ Chat Session Management (Create, Rename, Delete)
✅ Persistent Chat Storage
✅ Gemini API Integration
✅ Responsive UI Design
✅ User Profile Management

## Frontend Components

- **ChatContainer**: Main chat application component
- **ChatWindow**: Displays chat messages with markdown support
- **ChatWindowSkeleton**: Loading skeleton for chat interface
- **InputBox**: User message input component
- **Sidebar**: Chat history sidebar with navigation
- **ProfileModal**: User profile information display
- **RenameModal**: Chat title rename dialog

## Frontend Pages

- **Home**: Main chat interface (`/`)
- **Diagnostics**: Diagnostics page (`/diagnostics`)
- **Auth Pages**: Google OAuth handled by next-auth

## Development

### Running Tests

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

### Code Structure

**Backend:**
```
backend/
├── main.py              # Entry point
├── app/
│   ├── config.py        # Configuration
│   ├── database.py      # Database setup
│   ├── models/          # SQLAlchemy models
│   ├── routes/          # API endpoints
│   ├── schemas/         # Pydantic schemas
│   └── services/        # Business logic
```

**Frontend:**
```
frontend/
├── app/
│   ├── page.js          # Home page
│   ├── layout.js        # Root layout
│   ├── components/      # React components
│   ├── lib/             # Utilities & helpers
│   ├── styles/          # CSS modules
│   └── diagnostics/     # Diagnostics page
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running: `psql --version`
- Check DATABASE_URL in backend `.env`
- Verify database exists: `psql -U postgres -l`

### Gemini API Errors
- Verify API key is correct and valid
- Check Gemini API quota in Google Cloud Console
- Ensure API is enabled in Google Cloud Project

### Frontend/Backend Connection Issues
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS is properly configured
- Ensure backend is running and accessible

### Authentication Issues
- Verify Google OAuth credentials
- Check NEXTAUTH_SECRET is set
- Clear browser cookies and try again

## Performance Optimization

- Lazy loading of chat components
- Message virtualization for large chat histories
- API request debouncing
- Database query optimization with indexes

## Security Considerations

- Use strong `NEXTAUTH_SECRET` in production
- Never commit `.env` files
- Validate all user input
- Use HTTPS in production
- Enable CORS for production domain only
- Implement rate limiting for API

## License

This project is provided as-is for educational purposes.

## Support

For issues or questions, please refer to:
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth Documentation](https://next-auth.js.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Google Gemini API Documentation](https://ai.google.dev/docs)

## Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE ai_chat_db;
```

2. Database tables will be created automatically when the backend starts.

## API Endpoints

- `POST /api/chat` - Send message and get AI response
- `GET /api/chats` - Get all chats for user
- `GET /api/chats/{chat_id}` - Get specific chat with messages
- `DELETE /api/chats/{chat_id}` - Delete a chat
- `GET /health` - Health check

## Features

- ✅ Google OAuth Authentication
- ✅ Real-time chat interface
- ✅ Chat history persistence
- ✅ AI responses with context awareness
- ✅ Message deletion
- ✅ User profile modal
- ✅ Responsive design
