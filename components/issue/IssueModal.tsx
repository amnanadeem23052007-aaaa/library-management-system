"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  fetchIssues: () => void;
  issue?: any;
};

export default function IssueModal({
  open,
  onClose,
  fetchIssues,
  issue,
}: Props) {
  const [books, setBooks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    loadData();
  }, [open]);

  useEffect(() => {
    if (issue) {
      setBookId(issue.book?._id || "");
      setMemberId(issue.member?._id || "");
    } else {
      setBookId("");
      setMemberId("");
    }
  }, [issue]);

  async function loadData() {
    try {
      const [booksRes, membersRes] = await Promise.all([
        fetch("/api/books"),
        fetch("/api/members"),
      ]);

      const booksData = await booksRes.json();
      const membersData = await membersRes.json();

      setBooks(booksData.books || []);
      setMembers(membersData.members || []);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSubmit() {
  if (!bookId || !memberId) {
    alert("Select Book and Member");
    return;
  }

  setLoading(true);

  try {
    let res;

    if (issue) {
      // EDIT
      res = await fetch(`/api/issue-books/${issue._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          memberId,
        }),
      });
    } else {
      // ADD
      res = await fetch("/api/issue-books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          memberId,
        }),
      });
    }

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert(issue ? "Issue Updated Successfully" : "Book Issued Successfully");

    fetchIssues();

    onClose();
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
}

if (!open) return null;

return (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50" style={{padding:"20px"}}>

    <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8" style={{padding:"20px"}}>

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-3xl font-bold" style={{padding:"20px"}}>
          {issue ? "Edit Issue" : "Issue Book"}
        </h2>

        <button onClick={onClose}>
          <X />
        </button>

      </div>

      <div className="space-y-5" style={{padding:"20px"}}>

        <select
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="w-full h-12 border rounded-xl px-4" style={{margin:"5px", padding:"5px"}}
        >
          <option value="">Select Book</option>

          {books.map((book: any) => (
            <option key={book._id} value={book._id}>
              {book.title} ({book.available})
            </option>
          ))}

        </select>

        <select
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="w-full h-12 border rounded-xl px-4"style={{margin:"5px",padding:"5px"}}
        >
          <option value="">Select Member</option>

          {members.map((member: any) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}

        </select>

      </div>

      <div className="flex justify-end gap-4 mt-8" style={{padding:"20px"}}>

        <button
          onClick={onClose}
          className="border px-6 py-3 rounded-xl" style={{padding:"20px"}}
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl" style={{padding:"20px"}}
        >
          {loading
            ? "Saving..."
            : issue
            ? "Save Changes"
            : "Issue Book"}
        </button>

      </div>

    </div>

  </div>
);
}