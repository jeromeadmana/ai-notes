import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";

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
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-6 p-4">
        <h2 className="text-2xl font-bold mb-4">
          {editingId ? "Edit Note" : "Create Note"}
        </h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <textarea
          className="border p-2 w-full mb-2"
          rows={4}
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSave}
            disabled={loading}
          >
            {editingId ? "Update Note" : "Add Note"}
          </button>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded"
            onClick={() => handleSuggestTitle(newNote.content)}
            disabled={loading}
          >
            AI Suggest Title
          </button>
        </div>

        {loading && <Spinner />}

        <h2 className="text-2xl font-bold mt-6">My Notes</h2>
        {notes.map((note) => (
          <div key={note.id} className="border p-3 mt-2 rounded shadow">
            <h3 className="text-xl font-semibold">{note.title}</h3>
            <p className="text-gray-700">{note.content}</p>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleEdit(note)}
                disabled={loading}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(note.id)}
                disabled={loading}
              >
                Delete
              </button>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
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
  );
}
