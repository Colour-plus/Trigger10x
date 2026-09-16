# TRIGGER10X Website Backend

Website-only backend for contact/enquiry submissions.

## Requirements
- Node.js 18+
- PostgreSQL 14+

## Setup
1. Create PostgreSQL database named `trigger10x`.
2. Run `database/schema.sql` against that database.
3. Copy `.env.example` to `.env` and set DATABASE_URL, FRONTEND_URL and ADMIN_API_KEY.
4. Run `npm install`.
5. Run `npm run dev`.

## Public endpoint
POST `/api/enquiries`

Body:
```json
{"name":"Jane Doe","company":"ABC","phone":"+919999999999","email":"jane@example.com","subject":"Business Development","message":"I would like to discuss..."}
```

## Admin endpoints
Send `x-admin-key: <ADMIN_API_KEY>`.
- GET `/api/enquiries`
- GET `/api/enquiries/:id`
- PATCH `/api/enquiries/:id/status` body `{ "status": "CONTACTED" }`
- DELETE `/api/enquiries/:id`
