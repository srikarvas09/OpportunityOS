# OpportunityOS Backend

Express API using `mysql2/promise`.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env`, configure your local MySQL credentials, then run:

```bash
npm run dev
```

Available routes in this supplied backend:
- `GET /api/test-db`
- `GET /api/opportunities`
- `GET /api/opportunities/enriched`
- `POST /api/applications`

The frontend still uses a localStorage-backed mock API at this stage. More endpoints and frontend integration are required for full persistence.
