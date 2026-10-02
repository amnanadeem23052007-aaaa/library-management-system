"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Issue = {
  _id: string;
  fine: number;
  book: {
    _id: string;
    title: string;
  };
  member: {
    _id: string;
    name: string;
  };
};

type Props = {
  open: boolean;
  onClose: () => void;
  issue?: any;
};

export default function ReturnModal({
  open,
  onClose,
  issue,
}: Props) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [issueId, setIssueId] = useState("");
  const [fine, setFine] = useState("");

  // Load issued books only when adding a return
  useEffect(() => {
    if (!open) return;

    if (!issue) {
      loadIssuedBooks();
    }
  }, [open]);

  // Edit Mode
  useEffect(() => {
    if (issue) {
      setIssueId(issue._id);

      setFine(String(issue.fine || 0));
    } else {
      setIssueId("");
      setFine("");
    }
  }, [issue]);

  async function loadIssuedBooks() {
    try {
      const res = await fetch("/api/return-books");

      const data = await res.json();

      if (data.success) {
        setIssues(data.issuedBooks || []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const selected = issue
    ? issue
    : issues.find((item) => item._id === issueId);
      async function handleSubmit() {
    if (!issueId) {
      alert("Please select issued book.");
      return;
    }

    try {
      const res = await fetch("/api/return-books", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issueId,
          fine,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(issue ? "Return Updated Successfully" : "Book Returned Successfully");

      onClose();

      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50" style={{padding:"20px"}}>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8" style={{padding:"20px"}}>

        <div className="flex justify-between items-center mb-8" style={{padding:"20px"}}>

          <h2 className="text-3xl font-bold" style={{padding:"20px"}}>
            {issue ? "Edit Return" : "Return Book"}
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="space-y-5" style={{padding:"20px"}}>

          {!issue && (
            <select
              value={issueId}
              onChange={(e) => setIssueId(e.target.value)}
              className="w-full h-12 border rounded-xl px-4" 
            >
              <option value="">
                Select Issued Book
              </option>

              {issues.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.book.title} - {item.member.name}
                </option>
              ))}
            </select>
          )}

          <input
            readOnly
            value={selected?.book?.title || ""}
            placeholder="Book Name"
            className="w-full h-12 border rounded-xl px-4 bg-gray-100" style={{marginTop:"5px",padding:"5px"}}
          />

          <input
            readOnly
            value={selected?.member?.name || ""}
            placeholder="Member Name"
            className="w-full h-12 border rounded-xl px-4 bg-gray-100" style={{marginTop:"5px",padding:"5px"}}
          />

          <input
            type="number"
            value={fine}
            onChange={(e) => setFine(e.target.value)}
            placeholder="Fine"
            className="w-full h-12 border rounded-xl px-4" style={{marginTop:"5px",padding:"5px"}}
          />

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="border px-6 py-3 rounded-xl" style={{marginTop:"5px",padding:"15px"}}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-3 rounded-xl"style={{marginTop:"5px",padding:"15px"}}
          >
            {issue ? "Save Changes" : "Submit"}
          </button>

        </div>

      </div>

    </div>
  );
}