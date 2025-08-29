import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import "./Notes.css";

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hideButton, setHideButton] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editingId) {
        await API.put(`/notes/${editingId}`, newNote);
      } else {
        await API.post("/notes", newNote);
      }
      setNewNote({ title: "", content: "" });
      setEditingId(null);
      fetchNotes();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setNewNote({ title: note.title, content: note.content });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await API.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete note");
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async (content: string) => {
    setLoading(true);
    try {
      const res = await API.post("/ai/summarize", { text: content });
      alert("Summary: " + res.data.summary);
    } catch (err: any) {
      alert(err.response?.data?.error || "AI summarization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestTitle = async (content: string) => {
    setLoading(true);
    try {
      const res = await API.post("/ai/title", { text: content });
      setNewNote({ ...newNote, title: res.data.title });
      alert("Suggested title: " + res.data.title);
    } catch (err: any) {
      alert(err.response?.data?.error || "AI title suggestion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notes-container">
      <Navbar />

      <div className="notes-content">
        <div className="create-note">
          <h2>{editingId ? "Edit Note" : "Create Note"}</h2>
          <input
            className="note-input"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <textarea
            className="note-textarea"
            rows={4}
            placeholder="Content"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          />
          <div className="note-buttons">
            <button className="note-button" onClick={handleSave} disabled={loading}>
              {editingId ? "Update Note" : "Add Note"}
            </button>
            {!hideButton && (
              <button
                className="note-button secondary"
                onClick={() => handleSuggestTitle(newNote.content)}
                disabled={loading}
              >
                AI Suggest Title
              </button>
            )}
          </div>
        </div>

        {loading && <Spinner />}

        <div className="notes-list">
          <h2>My Notes</h2>
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div className="note-actions">
                <button
                  className="action-button edit"
                  onClick={() => handleEdit(note)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  className="action-button delete"
                  onClick={() => handleDelete(note.id)}
                  disabled={loading}
                >
                  Delete
                </button>
                <button
                  className="action-button summarize"
                  onClick={() => handleSummarize(note.content)}
                  disabled={loading}
                >
                  Summarize
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
