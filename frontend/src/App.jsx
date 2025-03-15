//ketabkhoneye react ro import mikone ke betonim az JSX estefada konim.
//CreateContext ye raveshio misaze ke data ro betonim share konim beyne komponent ha.
//useContext tamame data haro az context miare.
//useEffect köra mishe to zaman haye mokhtalef mese mogheye ladda kardane safe.
//useSate data haii ke gharare taghir konan ro mese variable zire nazar dare.
//useParams etelaat ro az URL miare mese ID.
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

//inja ham home kompennet khodemono misazim.
//inja ham be threads va setThreads ke az ForumContext migirim be komake useForum();
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
      <p>Welcome to the forum! Feel free to create a new thread.</p>
      <Link to="/new" className="button">
        {""}
        Create a new thread
      </Link>
      {threads.map((t) => (
        <div key={t.id} className="thread-container">
          {" "}
          <Link to={`/threads/${t.id}`} className="thread">
            {" "}
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

//inja ye komponent misaze ke ye tråd e entekhab shode ro neshon mide.
const Thread = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [error, setError] = useState(null);
  const [editingThread, setEditingThread] = useState(false);
  const [editedThreadContent, setEditedThreadContent] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyContent, setEditedReplyContent] = useState("");

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

  const editThread = () => {
    fetch(`http://localhost:5000/threads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: editedThreadContent,
        title: thread.title,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update thread");
        }
        return res.json();
      })
      .then(() => {
        setThread((prev) => ({
          ...prev,
          content: editedThreadContent,
        }));
        setEditingThread(false);
      })
      .catch((error) => {
        console.error("Error editing thread:", error);
        setError(error.message);
      });
  };

  const editReply = (replyId) => {
    fetch(`http://localhost:5000/threads/${id}/replies/${replyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editedReplyContent }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update reply");
        }
        return res.json();
      })
      .then(() => {
        setThread((prev) => ({
          ...prev,
          replies: prev.replies.map((reply) =>
            reply.id === replyId
              ? { ...reply, content: editedReplyContent }
              : reply
          ),
        }));
        setEditingReplyId(null);
        setEditedReplyContent("");
      })
      .catch((error) => {
        console.error("Error editing reply:", error);
        setError(error.message);
      });
  };

  if (!thread) return <p>Loading...</p>;

  return (
    <div className="container">
      <Link to="/" className="button">
        Home
      </Link>

      {/* Thread display/edit */}
      {editingThread ? (
        <div>
          <input
            className="input"
            value={editedThreadContent}
            onChange={(e) => setEditedThreadContent(e.target.value)}
          />
          <button className="button" onClick={editThread}>
            Save
          </button>
          <button className="button" onClick={() => setEditingThread(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h2>{thread.thread?.title || thread.title}</h2>
          <p>{thread.thread?.content || thread.content}</p>
          <button
            className="button"
            onClick={() => {
              setEditingThread(true);
              setEditedThreadContent(thread.thread?.content || thread.content);
            }}
          >
            Edit Thread
          </button>
        </div>
      )}

      <h3>Replies</h3>
      {thread.replies &&
        thread.replies.map((r) => (
          <div key={r.id}>
            {editingReplyId === r.id ? (
              <div>
                <input
                  className="input"
                  value={editedReplyContent}
                  onChange={(e) => setEditedReplyContent(e.target.value)}
                />
                <button className="button" onClick={() => editReply(r.id)}>
                  Save
                </button>
                <button
                  className="button"
                  onClick={() => setEditingReplyId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p className="reply">{r.content}</p>
                <button
                  className="button"
                  onClick={() => {
                    setEditingReplyId(r.id);
                    setEditedReplyContent(r.content);
                  }}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
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
        Add Reply
      </button>
    </div>
  );
};

//ye component misazim ke ye tråd jadid misazim.
//inja az ForumContext data migire ba komake setThreads.
//ye variable baraye title tråd ke az aval khalie.
//ye variable baraye content tråd ke az aval khalie.
//ye liste khali misaze ke tråd haye ezafe shode ro neshon bede.
const NewThread = () => {
  const { setThreads } = useForum();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submittedThreads, setSubmittedThreads] = useState([]);
  const [error, setError] = useState(null);

  //ye funktion ke tråd jadid ro befreste.
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
      body: JSON.stringify({ title, content }), //in kod data ro amde mikone ke be server befreste. stringify objekt ro be string mamoli be formate JSON tabdil mikone ke server betone befahme.
    }) //kollan inke title va content ro be JSON tabdil mikone ke server befahme.
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

  //neshon mide ke chi neshon dade mishe va linke bargasht be home ro misaze.
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
        {" "}
        Submit
      </button>
      <div className="submitted-threads">
        {submittedThreads.map((thread, index) => (
          <div key={index}>
            {" "}
            <h2>{thread.title}</h2>
            <p>{thread.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

//Edit a reply in a thread.

// inja ham component aslio ro misaze va ham hamon context ro.
// router darvaghe hamon navigation beyne safehat ro aktiv mikone.
// ForumProvider hameye data haro az hameye komponent haye forumdata dakhele khodesh gharar mide.
// Routes tsmim migire ke kodom komponent ha bar asase URL namayesh dade beshan.
// hameye in koda dakhele <Router> gharar daran chon React bayad navigering beyne safehat ro tanzim kone.
// ForumProvider be in niaz nadare va faghat baraye orginaz kardan behtare kod hastesh.
// ForumProvider data ro az threads be komponentha mide.
//khode Router az react-router-dom miad ke betone ye system besaze ke betonim beyne safehat navigera konim.
//kollan Router va Routes tasmim migiran ba asase kodom URL ha kodom safe bayad neshon dade beshe.

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

//export mikone app ro ke betone to file haye dg ham estefade beshan.
export default App;
