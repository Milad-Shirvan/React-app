# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.






# Forum App README

## Kort beskrivning av projektet
Detta projekt är en enkel forumapplikation byggd med **React** på frontend och **Node.js/Express** på backend. Användare kan skapa trådar, lägga till svar och radera trådar. Data lagras i en SQLite-databas (`forum.db`), och frontend kommunicerar med backend via ett RESTful API. Projektet använder React Router för navigering och Context API för att hantera tillstånd.

---

## Installationsinstruktioner

### Förutsättningar
- **Node.js** (version 18 eller senare rekommenderas)
- **npm** (installeras med Node.js)
- En terminal för att köra kommandon

### Steg för installation

1. **Klona projektet**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Installera backend-beroenden**
   - Navigera till backend-mappen (om du har en separat mapp, annars gör detta i rotmappen):
   ```bash
   npm install express cors better-sqlite3 nodemon
   ```
   - Detta installerar:
     - `express`: Webbramverk för Node.js.
     - `cors`: För att tillåta cross-origin requests från frontend.
     - `better-sqlite3`: SQLite-databasdrivrutin.
     - `nodemon`: Verktyg för att automatiskt starta om servern vid kodändringar.

3. **Installera frontend-beroenden**
   - Navigera till frontend-mappen (t.ex. `client` om du har en sådan struktur, annars rotmappen):
   ```bash
   npm install
   npm install vite react react-router-dom
   ```
   - Detta installerar:
     - `vite`: Byggverktyg och utvecklingsserver för frontend.
     - `react`: React-biblioteket.
     - `react-router-dom`: För routning i React.

4. **Projektstruktur**
   - Om du har en separat mapp för frontend och backend (t.ex. `client` och `server`), se till att köra installationskommandon i respektive mapp.
   - Annars antas att allt ligger i samma mapp med `App.jsx` för frontend och `server.js` för backend.

---

## Startkommandon

### Backend
1. **Starta servern med nodemon**
   - I backend-mappen (eller rotmappen):
   ```bash
   npx nodemon server.js
   ```
   - Servern körs på `http://localhost:5000`. `nodemon` startar om servern automatiskt vid ändringar.

2. **Starta servern utan nodemon (alternativt)**
   ```bash
   node server.js
   ```

### Frontend
1. **Starta utvecklingsservern med Vite**
   - I frontend-mappen (eller rotmappen):
   ```bash
   npm run dev
   ```
   - Öppna `http://localhost:5173` (eller den port Vite anger) i webbläsaren.

2. **Bygg frontend för produktion (valfritt)**
   ```bash
   npm run build
   ```
   - Detta skapar en `dist`-mapp som kan serveras statiskt.

### Kör båda samtidigt
- Öppna två terminaler:
  - Terminal 1 (backend): `npx nodemon server.js`
  - Terminal 2 (frontend): `npm run dev`

---

## Kort beskrivning av projektet
- **Frontend**: Byggt med React, använder Vite som byggverktyg. Inkluderar tre huvudsidor:
  - **Hem** (`/`): Visar en lista med trådar och en knapp för att skapa nya.
  - **Tråd** (`/threads/:id`): Visar en specifik tråd och dess svar, med möjlighet att lägga till nya svar.
  - **Ny tråd** (`/new`): Formulär för att skapa en ny tråd.
- **Backend**: En Express-server som hanterar API-anrop och lagrar data i en SQLite-databas (`forum.db`). API-endpoints:
  - `GET /threads`: Hämta alla trådar.
  - `GET /threads/:id`: Hämta en tråd och dess svar.
  - `POST /threads`: Skapa en ny tråd.
  - `POST /threads/:id/replies`: Lägga till ett svar.
  - `DELETE /threads/:id`: Radera en tråd och dess svar.

---

## Övrig information

### Använda paket
- **Backend**:
  - `express`: "^4.18.2"
  - `cors`: "^2.8.5"
  - `better-sqlite3`: "^8.6.0"
  - `nodemon`: "^3.0.1" (dev-beroende)
- **Frontend**:
  - `react`: "^18.2.0"
  - `react-router-dom`: "^6.16.0"
  - `vite`: "^4.4.9" (dev-beroende)

### Databas
- SQLite-databasen (`forum.db`) skapas automatiskt första gången servern körs.
- Två tabeller används:
  - `threads`: Lagrar trådar (`id`, `title`, `content`).
  - `replies`: Lagrar svar (`id`, `thread_id`, `content`), kopplad till `threads` via en främmande nyckel.

### Felsökning
- Om du får `500 Internal Server Error`:
  - Kontrollera serverloggen i terminalen där `nodemon` körs.
  - Se till att `forum.db` är skrivbar (`chmod 666 forum.db` på Unix/Mac).
- Om frontend inte kan ansluta till backend:
  - Kontrollera att servern körs på `http://localhost:5000`.
  - Se till att CORS är aktiverat (det är redan inkluderat i backend).

### Utöka projektet
- Lägg till autentisering för användare.
- Implementera pagination för trådar.
- Lägg till styling i `styles.css` för ett bättre utseende.