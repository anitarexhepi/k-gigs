# K-Gigs Platform

K-Gigs eshte nje platforme per lidhjen e freelancer-eve me punedhenesit.  
Perdoruesit mund te krijojne profile, te postojne pune (gigs), dhe te aplikojne per to.

---

## Teknologjite e perdorura

### Frontend
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Databaza
- MySQL

### Autentifikimi
- JSON Web Token (JWT)

---

## Funksionalitetet kryesore

### Users
- Regjistrim dhe login
- Role: freelancer, punedhenes, admin
- Admin CRUD per perdoruesit

---

### Gigs
- Punedhenesi krijon, perditeson dhe fshin gig
- Freelancer shikon dhe aplikon
- Filtrim, kerkim dhe sortim

---

### Applications
- Freelancer aplikon per gig
- Edit dhe delete aplikim
- Punedhenesi pranon ose refuzon aplikimet

---

### CV
- Freelancer CRUD per CV

---

### Contact Messages
- User dergon mesazh
- Admin CRUD per mesazhe

---

### Dashboard
- Freelancer Dashboard
- Punedhenes Dashboard
- Admin Dashboard

---

## Autentifikimi dhe Siguria

- JWT perdoret per autentifikim
- Token ruhet ne localStorage
- Protected routes sipas role:
  - admin
  - freelancer
  - punedhenes

---

## Databaza (Shembull strukture)

### Users
- id (PK)
- email
- password
- role

### Gigs
- id (PK)
- title
- description
- budget
- user_id (FK)

### Applications
- id (PK)
- gig_id (FK)
- user_id (FK)
- cover_letter

---

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Users
- GET /api/admin/users
- POST /api/admin/users
- PUT /api/admin/users/:id
- DELETE /api/admin/users/:id

### Gigs
- GET /api/gigs
- GET /api/gigs/:id
- POST /api/gigs
- PUT /api/gigs/:id
- DELETE /api/gigs/:id

### Applications
- POST /api/applications
- PUT /api/applications/:id
- DELETE /api/applications/:id

### Contact
- POST /api/contact
- GET /api/contact
- PUT /api/contact/:id
- DELETE /api/contact/:id

---

## Si te startohet projekti

### 1. Clone repo
```bash
git clone https://github.com/anitarexhepi/k-gigs.git
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```