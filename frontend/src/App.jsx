import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Link, useParams } from "react-router-dom";
import "./styles.css";

const ForumContext = createContext();
const useForum = () => useContext(ForumContext);

const ForumProvider = ({ children }) => {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/threads")
      .then((res) => res.json())
      .then(setThreads)
      .catch((error) => console.error("Error fetching threads:", error));
  }, []);

  return (
    <ForumContext.Provider value={{ threads, setThreads }}>
      {children}
    </ForumContext.Provider>
  );
};

const Home = () => {
  const { threads, setThreads } = useForum();

  const deleteThread = (threadId) => {
    fetch(`http://localhost:5000/threads/${threadId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete thread");
        }
        setThreads((prevThreads) =>
          prevThreads.filter((thread) => thread.id !== threadId)
        );
      })
      .catch((error) => console.error("Error deleting thread:", error));
  };

  return (
    <div className="container">
      <h1>Forum App</h1>
      <Link to="/new" className="button">
        Create New Thread
      </Link>
      {threads.map((t) => (
        <div key={t.id} className="thread-container">
          <Link to={`/threads/${t.id}`} className="thread">
            <h3>{t.title}</h3>
          </Link>
          <button className="delete-button" onClick={() => deleteThread(t.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

const Thread = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/threads/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch thread");
        }
        return res.json();
      })
      .then(setThread)
      .catch((error) => console.error("Error fetching thread:", error));
  }, [id]);

  const addReply = () => {
    setError(null);
    if (!newReply.trim()) {
      setError("Reply cannot be empty");
      return;
    }

    fetch(`http://localhost:5000/threads/${id}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newReply }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.error || "Server responded with an error");
          });
        }
        return res.json();
      })
      .then(() => {
        const newReplyObj = {
          id: Date.now(),
          thread_id: id,
          content: newReply,
        };
        setThread((prev) => ({
          ...prev,
          replies: [...prev.replies, newReplyObj],
        }));
        setNewReply("");
      })
      .catch((error) => {
        console.error("Error adding reply:", error);
        setError(error.message);
      });
  };

  if (!thread) return <p>Loading...</p>;

  return (
    <div className="container">
      <Link to="/" className="button">
        Hem
      </Link>
      <h2>{thread.thread?.title || thread.title}</h2>
      <p>{thread.thread?.content || thread.content}</p>
      <h3>Replies</h3>
      {thread.replies &&
        thread.replies.map((r) => (
          <p key={r.id} className="reply">
            {r.content}
          </p>
        ))}
      {error && <p className="error">{error}</p>}
      <input
        className="input"
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)}
        placeholder="Write a reply..."
      />
      <p>
        <strong>Preview:</strong> {newReply}
      </p>
      <button className="button" onClick={addReply}>
        Reply
      </button>
    </div>
  );
};

const NewThread = () => {
  const { setThreads } = useForum();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submittedThreads, setSubmittedThreads] = useState([]);
  const [error, setError] = useState(null);

  const submit = () => {
    setError(null);
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }

    fetch("http://localhost:5000/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.error || "Server responded with an error");
          });
        }
        return res.json();
      })
      .then((thread) => {
        setThreads((prev) => [...prev, thread]);
        setSubmittedThreads((prev) => [...prev, thread]);
        setTitle("");
        setContent("");
      })
      .catch((error) => {
        console.error("Error submitting thread:", error);
        setError(error.message);
      });
  };

  return (
    <div className="container">
      <Link to="/" className="button">
        Hem
      </Link>
      <h1>New Thread</h1>
      {error && <p className="error">{error}</p>}
      <input
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <p>
        <strong>Title Preview:</strong> {title}
      </p>
      <textarea
        className="input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <p>
        <strong>Content Preview:</strong> {content}
      </p>
      <button className="button" onClick={submit}>
        Create
      </button>
      <div className="submitted-threads">
        {submittedThreads.map((thread, index) => (
          <div key={index}>
            <h2>{thread.title}</h2>
            <p>{thread.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <ForumProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/threads/:id" element={<Thread />} />
        <Route path="/new" element={<NewThread />} />
      </Routes>
    </ForumProvider>
  </Router>
);

export default App;
