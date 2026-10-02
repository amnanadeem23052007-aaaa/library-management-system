"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { BookService } from "@/services/book.service";
import { SUBJECT_CATEGORIES } from "@/data/books";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddBookModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await BookService.addBook({
        title: form.title,
        author: form.author,
        category: form.category,
        isbn: form.isbn,
        quantity: Number(form.quantity),
      });

      alert("Book Added Successfully");

      setForm({
        title: "",
        author: "",
        category: "",
        isbn: "",
        quantity: "",
      });

      onClose();

      onSuccess?.();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50" style={{ margin: "5px", padding: "15px" }}>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8" style={{ margin: "5px", padding: "15px" }}>

        <div className="flex justify-between items-center mb-8" style={{ margin: "5px", padding: "15px" }}>

          <h2 className="text-3xl font-bold" >
            Add New Book
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Book Title"
            className="border rounded-xl h-12 px-4" style={{ margin: "5px", padding: "15px" }}
          />

          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Author"
            className="border rounded-xl h-12 px-4" style={{ margin: "5px", padding: "15px" }}
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category (e.g. Mathematics, AI)"
            list="add-category-suggestions"
            className="border rounded-xl h-12 px-4" style={{ margin: "5px", padding: "15px" }}
          />
          <datalist id="add-category-suggestions">
            {SUBJECT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>

          <input
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            placeholder="ISBN"
            className="border rounded-xl h-12 px-4" style={{ margin: "5px", padding: "15px" }}
          />

          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="border rounded-xl h-12 px-4" style={{ margin: "5px", padding: "15px" }}
          />

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="border px-6 py-3 rounded-xl" style={{ margin: "5px", padding: "15px" }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl" style={{ margin: "5px", padding: "15px" }}
          >
            {loading ? "Saving..." : "Save Book"}
          </button>

        </div>

      </div>

    </div>
  );
}