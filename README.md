# 🚀 AI Chat Application

A full-stack AI chat application built with **Next.js (Frontend)** and **FastAPI (Backend)**, powered by **Google Gemini API** for intelligent responses.

---

## 🎯 Features

* ✅ Google OAuth Authentication
* ✅ Real-time Chat Interface
* ✅ Persistent Chat History (PostgreSQL)
* ✅ Multi-turn AI Conversations (Gemini API)
* ✅ Chat Management (Create, Rename, Delete)
* ✅ Markdown Rendering
* ✅ Responsive UI

---

## 🛠️ Tech Stack

### Frontend

* Next.js 13+
* React
* next-auth (Google OAuth)
* Axios
* Material UI
* React Markdown

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* Google Gemini API
* Python 3.9+

---

## 📋 Prerequisites

* Node.js 18+
* Python 3.9+
* PostgreSQL 12+
* Docker (optional)

---

## 🚀 Setup Guide

---

## 🔹 Backend Setup

```bash
cd backend

python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

Create `.env`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_chat_db
GOOGLE_GEMINI_API_KEY=your-api-key
FASTAPI_ENV=development
```

Run backend:

```bash
python main.py
```

---

## 🔹 Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-min-32-chars
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run frontend:

```bash
npm run dev
```

---

## 🗄️ Database Setup

```sql
CREATE DATABASE ai_chat_db;
```

```bash
psql -U postgres -d ai_chat_db -f backend/database.sql
```

---

## 🔑 API Keys Setup

### Google OAuth

* Go to Google Cloud Console
* Create OAuth credentials
* Add redirect:

```
http://localhost:3000/api/auth/callback/google
```

### Gemini API

* Go to Google AI Studio
* Generate API key
* Add to backend `.env`

---

## 🐳 Docker Setup (Optional)

```bash
docker-compose up
```

---

## 🌐 Run Application

* Frontend → http://localhost:3000
* Backend → http://localhost:8000
* API Docs → http://localhost:8000/docs

---

## 📡 API Endpoints

### Chats

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | /api/chats           |
| GET    | /api/chats           |
| GET    | /api/chats/{chat_id} |
| DELETE | /api/chats/{chat_id} |
| PUT    | /api/chats/{chat_id} |

### Messages

| Method | Endpoint                      |
| ------ | ----------------------------- |
| POST   | /api/chats/{chat_id}/messages |
| GET    | /api/chats/{chat_id}/messages |

---

## 🔐 Headers

```
X-User-Email: user@example.com
```

---

## 📁 Project Structure

```
AI Chat App/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── config.py
│   │   └── database.py
│   ├── main.py
│   └── database.sql
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   ├── styles/
│   │   └── page.js
│   ├── package.json
│   └── .env.local
│
└── docker-compose.yml
```

---

## 🐛 Troubleshooting

### Backend Issues

* Check PostgreSQL is running
* Verify `DATABASE_URL`
* Ensure API key is correct

### Frontend Issues

* Check `NEXT_PUBLIC_API_URL`
* Run `npm install` again

### Auth Issues

* Verify Google credentials
* Check redirect URI
* Clear browser cookies

---

## 🔐 Security Notes

* Do not commit `.env` files
* Use strong secrets in production
* Enable HTTPS in production

---

## 📚 Resources

* FastAPI: https://fastapi.tiangolo.com/
* Next.js: https://nextjs.org/docs
* NextAuth: https://next-auth.js.org/
* Gemini API: https://ai.google.dev

---

## 📄 License

This project is for educational purposes.

---

## 🎉 Done!

You now have a fully working AI Chat Application 🚀
