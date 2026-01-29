# Veterans Sportsmens Association (VSA)

Veterans Serving Veterans — website for the Veterans Sportsmens Association.

## Project structure

- **frontend/** — React (Vite) app: UI, components, and client-side logic
- **backend/** — Node.js/Express API: authentication, user management, and content management

## Frontend

Built with **React 19** and **Vite 7**.

### Run locally

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173 (or the URL Vite prints).

### Build for production

```bash
cd frontend
npm run build
```

Output is in `frontend/dist/`.

### Frontend structure

```
frontend/
├── public/
├── src/
│   ├── components/    # UI components
│   │   ├── Nav.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Programs.jsx
│   │   ├── Events.jsx
│   │   ├── News.jsx
│   │   ├── Gallery.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   └── index.js
│   ├── data/          # Static data (events, programs, news, gallery)
│   │   ├── events.js
│   │   ├── programs.js
│   │   ├── news.js
│   │   └── gallery.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css      # Global styles & CSS variables
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Backend

Node.js/Express API server with authentication and content management.

### Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm start
# or for development:
npm run dev
```

The API will run on `http://localhost:3001` by default.

### Default Admin Account

- Email: `admin@vsa.org`
- Password: `admin123`

**⚠️ Change this in production!**

### API Endpoints

See `backend/README.md` for full API documentation.

## Frontend-Backend Connection

1. Copy `frontend/.env.example` to `frontend/.env`
2. Set `VITE_API_URL=http://localhost:3001/api` (or your backend URL)
3. The frontend will automatically connect to the backend API
