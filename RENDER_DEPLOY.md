# Render Deployment

This workspace contains two services:

- Backend: `KT_LOGIC_123-dctor-web-ac56e70abd75/backend`
- Frontend: `KT_LOGIC_123-dctor-frontend-f6bfd9d1d422`

A Render Blueprint is already defined at `/Users/maryalexissolis/Documents/doctr/render.yaml`.

## Deploy Steps

1. Push this workspace to a GitHub/GitLab repo.
2. In Render, click **New** -> **Blueprint**.
3. Connect the repo and select branch.
4. Render will detect `render.yaml` and create:
   - `dctor-backend` (Node web service)
   - `dctor-frontend` (Node web service)
5. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` on the frontend service (it is intentionally `sync: false`).
6. Deploy.

## Internal Service Wiring

- Frontend receives `API_HOSTPORT` from backend via private service link.
- Frontend server code resolves backend base URL as:
  - `API_URL` if explicitly set
  - else `http://$API_HOSTPORT/api`
  - else local fallback `http://127.0.0.1:3000/api`

## Health Check

Backend health endpoint is configured as:

- `/api/users/count`
