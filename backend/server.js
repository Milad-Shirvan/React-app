import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();
const db = new Database("forum.db");

app.use(cors());
app.use(express.json());

// Create tables if they don't exist
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS threads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL
  )
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
  )
`
).run();

// Get all threads
app.get("/threads", (req, res) => {
  const threads = db.prepare("SELECT * FROM threads").all();
  res.json(threads);
});

// Get a single thread with its replies
app.get("/threads/:id", (req, res) => {
  const thread = db
    .prepare("SELECT * FROM threads WHERE id = ?")
    .get(req.params.id);
  if (!thread) {
    return res.status(404).json({ error: "Thread not found" });
  }
  const replies = db
    .prepare("SELECT * FROM replies WHERE thread_id = ?")
    .all(req.params.id);
  res.json({ thread, replies });
});

// Create a new thread
app.post("/threads", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  const result = db
    .prepare("INSERT INTO threads (title, content) VALUES (?, ?)")
    .run(title, content);
  res.json({ id: result.lastInsertRowid, title, content });
});

// Add a reply to a thread
app.post("/threads/:id/replies", (req, res) => {
  const { content } = req.body;
  const threadId = req.params.id;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  // Check if thread exists before adding a reply
  const threadExists = db
    .prepare("SELECT id FROM threads WHERE id = ?")
    .get(threadId);
  if (!threadExists) {
    return res.status(404).json({ error: "Thread not found" });
  }

  db.prepare("INSERT INTO replies (thread_id, content) VALUES (?, ?)").run(
    threadId,
    content
  );
  res.json({ message: "Reply added" });
});

// Delete a thread and its replies (ON DELETE CASCADE will handle replies)
app.delete("/threads/:id", (req, res) => {
  const threadId = req.params.id;

  // Check if thread exists
  const thread = db
    .prepare("SELECT id FROM threads WHERE id = ?")
    .get(threadId);
  if (!thread) {
    return res.status(404).json({ error: "Thread not found" });
  }

  // Delete replies first
  db.prepare("DELETE FROM replies WHERE thread_id = ?").run(threadId);

  // Delete the thread
  db.prepare("DELETE FROM threads WHERE id = ?").run(threadId);

  res.json({ message: "Thread and replies deleted" });
});

//edit a reply
app.put("/threads/:threadId/replies/:replyId", (req, res) => {
    const { content } = req.body;
    const { threadId, replyId } = req.params;
  
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }
  
    const reply = db
      .prepare("SELECT * FROM replies WHERE id = ? AND thread_id = ?")
      .get(replyId, threadId);
  
    if (!reply) {
      return res.status(404).json({ error: "Reply not found" });
    }
  
    db.prepare("UPDATE replies SET content = ? WHERE id = ?")
      .run(content, replyId);
  
    res.json({ message: "Reply updated" });
  });

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
