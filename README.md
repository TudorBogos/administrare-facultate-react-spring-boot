# Portalul de Admitere — Admitere la facultate

Platformă full-stack pentru administrarea procesului de admitere: dashboard de administrare + API REST.

## Ce face

- Autentificare admin (cookie `admin_session`)
- CRUD pentru: facultăți, programe de studiu, candidați, dosare, opțiuni
- Procesare admitere: alocă locuri în funcție de medie și prioritatea opțiunilor
- Rezultate + rapoarte (CSV/PDF)

## Tehnologii

- Frontend: React Router (SPA), React, TypeScript, Vite, TailwindCSS
- Backend: Spring Boot, Spring MVC, Spring Data JPA, PostgreSQL, PDFBox

## Structură repo

- `admitere-facultate-frontend/` – UI admin
- `admitere_facultate_api/` – API REST

## Rulare locală

### 1) Pornește PostgreSQL

Config implicit în `admitere_facultate_api/src/main/resources/application.properties`:

- host: `localhost:5432`
- db/user/parolă: `postgres`

Exemplu cu Docker:

```bash
docker run --name isi-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

### 2) Pornește backend-ul

```bash
cd admitere_facultate_api
./mvnw spring-boot:run
```

API: `http://localhost:8080`.

### 3) Creează un admin (o singură dată)

Nu există endpoint public de „signup”; trebuie să existe cel puțin un rând în tabelul `admin`.

Variantă rapidă (în Postgres, cu `pgcrypto`):

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
INSERT INTO admin (email, parola_hash)
VALUES ('admin@facultate.ro', crypt('admin', gen_salt('bf')));
```

### 4) Pornește frontend-ul

```bash
cd admitere-facultate-frontend
npm install
npm run dev
```

UI: `http://localhost:5173`.

Vite face proxy pentru `/api` către `http://localhost:8080` (vezi `admitere-facultate-frontend/vite.config.ts`).

## API (pe scurt)

- `POST /api/auth/login` – login (setează cookie-ul)
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/admin/procesare` – rulează procesarea
- `GET /api/admin/rezultate` – ultimele rezultate
- `GET /api/admin/rapoarte/inscrieri-program(.csv|.pdf)`
- `GET /api/admin/rapoarte/rezultate-facultati`

## Note

- Sesiunile de admin și „ultimele rezultate” sunt ținute în memorie și se pierd la restart.
- Setările DB din `application.properties` sunt pentru development.
