# Goalixa Admin Panel

Admin panel for managing Goalixa platform users, analytics, system health, and settings.

## Tech Stack

- **Backend**: Python 3.11, FastAPI
- **Frontend**: React 18 + TypeScript, Tailwind CSS, Zustand, TanStack Query

## Project Structure

```
admin_panel/
├── app/                    # FastAPI backend
│   ├── config.py           # Configuration
│   ├── database.py        # Database connection
│   ├── main.py           # FastAPI app
│   └── routes/           # API routes
│       ├── auth.py       # Authentication
│       ├── users.py      # User management
│       ├── analytics.py  # Analytics
│       ├── health.py    # System health
│       └── settings.py   # Settings
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── lib/         # API client, auth
│   │   ├── pages/       # Page components
│   │   ├── stores/     # Zustand stores
│   │   └── styles/     # CSS styles
│   ├── package.json
│   └── vite.config.ts
├── helm/                  # Helm chart
├── .argo/                 # ArgoCD applications
└── .github/workflows/     # GitHub Actions
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/admin/api/auth/login` | Admin login |
| `/admin/api/users` | List users |
| `/admin/api/users/{id}` | Get user |
| `/admin/api/users/{id}/disable` | Disable user |
| `/admin/api/users/{id}/enable` | Enable user |
| `/admin/api/users/{id}/delete` | Delete user |
| `/admin/api/analytics` | Get analytics |
| `/admin/api/health` | System health |
| `/admin/api/settings` | Get/Update settings |

## Authentication

Admin access controlled via `SyntraUser.role=admin` in goalixa-auth database.

## Development

```bash
# Backend
cd admin_panel
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd admin_panel/frontend
npm install
npm run dev
```

## Deployment

Uses Helm chart for Kubernetes deployment via ArgoCD.

- Image: `harbor.goalixa.com/goalixa-admin`
- Ingress: `admin.goalixa.com`

---

**Last Updated**: 2026-05-13
**Version**: 1.0.0