# OpportunityOS

OpportunityOS is a React + TypeScript frontend with a Node.js + Express API and a MySQL database.

## Repository structure

- `frontend/` — React, TypeScript and Vite application.
- `backend/` — Express API and MySQL connection pool.
- `database/` — ordered database setup, schema, demo data and verification scripts.
- `database/source_sql/` — original SQL files supplied with the project, retained for reference.

## Requirements

- Node.js 20.19+ or 22.12+ (compatible with the Vite 8 toolchain)
- MySQL 8.0.16+
- npm

## Database setup

Open MySQL Workbench and execute these scripts in order:

1. `database/01_create_database.sql`
2. `database/02_create_tables.sql`
3. `database/03_insert_demo_data.sql`
4. `database/04_verify.sql`

The demo data is synthetic. Do not run `database/source_sql/insertioncrt.sql` unless you intentionally want to replace data; it contains `TRUNCATE TABLE` statements.

## Backend setup

1. Open a terminal in `backend/`.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and enter your local MySQL credentials.
4. Start the API:

   ```bash
   npm run dev
   ```

The API listens on `http://localhost:5000` by default. A database connectivity endpoint is available at `GET /api/test-db`.

## Frontend setup

1. Open a second terminal in `frontend/`.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start Vite:

   ```bash
   npm run dev
   ```

## Important integration status

The supplied frontend API service (`frontend/src/services/api.ts`) currently uses mock data and browser `localStorage`; it has not yet been switched over to call the Express API. The backend currently exposes database test, opportunity-read and application-create endpoints only. Therefore, this repository is organized for GitHub and contains a complete initial SQL schema, but the full frontend-to-MySQL CRUD integration is not yet complete.

Before presenting the application as fully database-backed, implement the remaining API routes and replace the frontend mock service calls with HTTP requests. Authentication is also not present in the supplied backend.

## Environment and secrets

Never commit `.env`, database passwords, API keys or real private user data. Use `.env.example` as the configuration template.
