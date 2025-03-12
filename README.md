# Forum App README

## Beskrivning

En enkel forumapp byggd med **React** (frontend) och **Node.js/Express** (backend). Användare kan skapa, visa och radera trådar samt lägga till svar. Data lagras i en SQLite-databas (`forum.db`).

---

## Installation

1. **Backend-beroenden**

   ```bash
   npm install express cors better-sqlite3 nodemon
   ```

2. **Frontend-beroenden**
   ```bash
   npm install vite react react-router-dom
   ```

---

## Startkommandon

- **Backend**: `npx nodemon server.js` (kör på `http://localhost:5000`)
- **Frontend**: `npm run dev` (kör på `http://localhost:5173`)
- Kör båda i separata terminaler.

---

## Övrigt

- **Paket**:
  - Backend: `express`, `cors`, `better-sqlite3`, `nodemon`
  - Frontend: `react`, `react-router-dom`, `vite`
- **Databas**: SQLite (`forum.db`) med tabellerna `threads` och `replies`.
- **Felsökning**: Kontrollera serverloggen vid fel (t.ex. `500 Internal Server Error`) och se till att `forum.db` är skrivbar.
