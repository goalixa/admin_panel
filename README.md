# Goalixa Admin Panel

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

Admin dashboard for managing Goalixa platform users, analytics, and settings.

## Features

| Feature | Description |
|---------|-------------|
| **User Management** | View, disable, enable, delete users |
| **Analytics** | Platform usage statistics |
| **System Health** | Service status monitoring |
| **Settings** | Platform configuration |

## Tech Stack

### Backend
- Python 3.11
- FastAPI

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state)
- TanStack Query (data fetching)

## Project Structure

```
admin_panel/
├── app/                   # FastAPI backend
│   ├── main.py           # App entry
│   ├── config.py         # Configuration
│   ├── database.py       # DB connection
│   └── routes/           # API routes
│       ├── auth.py
│       ├── users.py
│       ├── analytics.py
│       ├── health.py
│       └── settings.py
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   └── lib/
│   └── package.json
├── helm/                 # Kubernetes
└── Dockerfile
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /admin/api/auth/login` | Admin login |
| `GET /admin/api/users` | List users |
| `GET /admin/api/users/{id}` | Get user |
| `POST /admin/api/users/{id}/disable` | Disable user |
| `POST /admin/api/users/{id}/enable` | Enable user |
| `DELETE /admin/api/users/{id}` | Delete user |
| `GET /admin/api/analytics` | Get analytics |
| `GET /admin/api/health` | System health |
| `GET /admin/api/settings` | Get settings |
| `PUT /admin/api/settings` | Update settings |

## Getting Started

### Backend

```bash
cd admin_panel
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd admin_panel/frontend
npm install
npm run dev
```

## Deployment

### Docker

```bash
docker build -t goalixa-admin:latest .
docker run -p 8000:80 goalixa-admin:latest
```

### Kubernetes

```bash
helm upgrade --install goalixa-admin ./helm \
  --namespace goalixa \
  --create-namespace
```

## Authentication

Admin access is controlled via user roles in the auth database. Users with `role=admin` can access the admin panel.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built by [Amirreza Rezaie](https://github.com/amirrezarezaie)
# Sat May 30 16:52:30 +0330 2026
