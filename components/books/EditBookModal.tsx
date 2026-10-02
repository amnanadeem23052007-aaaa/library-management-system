"use client";

import { useEffect, useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { SUBJECT_CATEGORIES } from "@/data/books";

type Props = {
  open: boolean;
  onClose: () => void;
  book: any;
};

export default function EditBookModal({
  open,
  onClose,
  book,
}: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");
  const [available, setAvailable] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD SELECTED BOOK
  // =========================

  useEffect(() => {
    if (book) {
      setTitle(book.title || "");
      setAuthor(book.author || "");
      setCategory(book.category || "");
      setIsbn(book.isbn || "");
      setQuantity(
        book.quantity !== undefined
          ? String(book.quantity)
          : ""
      );

      setAvailable(
        book.available !== undefined
          ? String(book.available)
          : ""
      );

      setDescription(book.description || "");
    }
  }, [book]);

  // =========================
  // UPDATE BOOK
  // =========================

  const handleUpdate = async () => {
    if (!book?._id) {
      alert("Book ID not found");
      return;
    }

    // Basic validation

    if (
      !title.trim() ||
      !author.trim() ||
      !category.trim() ||
      !isbn.trim() ||
      !quantity
    ) {
      alert("Please fill all required fields");
      return;
    }

    const quantityNumber = Number(quantity);
    const availableNumber = Number(available);

    if (quantityNumber < 0) {
      alert("Quantity cannot be negative");
      return;
    }

    if (availableNumber < 0) {
      alert("Available books cannot be negative");
      return;
    }

    if (availableNumber > quantityNumber) {
      alert(
        "Available books cannot be greater than total quantity"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/books/${book._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),
            author: author.trim(),
            category: category.trim(),
            isbn: isbn.trim(),
            quantity: quantityNumber,
            available: availableNumber,
            description: description.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log("UPDATE BOOK RESPONSE:", data);

      if (!response.ok) {
        alert(
          data.message || "Failed to update book"
        );

        return;
      }

      alert("Book Updated Successfully!");

      // Close modal
      onClose();

    } catch (error) {
      console.error(
        "Update book error:",
        error
      );

      alert(
        "Something went wrong while updating the book."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // MODAL CLOSED
  // =========================

  if (!open) {
    return null;
  }

  // =========================
  // MODAL UI
  // =========================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/60
        backdrop-blur-sm
        p-4
      "
    >

      {/* ================= MODAL ================= */}

      <div
        className="
          w-full
          max-w-3xl
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          bg-white
          shadow-2xl
        "style={{ padding: "20px" }}
      >

        {/* ================= HEADER ================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            px-7
            py-5
          "style={{ padding: "20px" }}
        >

          <div>

            <h2
              className="
                text-2xl
                font-extrabold
                text-slate-900
              "style={{ padding: "20px" }}
            >
              Edit Book
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the information of this book
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-800
            "
          >
            <X size={22} />
          </button>

        </div>


        {/* ================= FORM ================= */}

        <div className="p-7">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2" style={{ padding: "20px" }}>

            {/* TITLE */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Book Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter book title"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                " style={{ padding: "10px" }}
              />

            </div>


            {/* AUTHOR */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Author
              </label>

              <input
                type="text"
                value={author}
                onChange={(e) =>
                  setAuthor(e.target.value)
                }
                placeholder="Enter author name"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                " style={{ padding: "10px" }}
              />

            </div>


            {/* CATEGORY */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                placeholder="e.g. Mathematics, Physics, AI"
                list="edit-category-suggestions"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                " style={{ padding: "10px" }}
              />
              <datalist id="edit-category-suggestions">
                {SUBJECT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>

            </div>


            {/* ISBN */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                ISBN
              </label>

              <input
                type="text"
                value={isbn}
                onChange={(e) =>
                  setIsbn(e.target.value)
                }
                placeholder="Enter ISBN"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                " style={{ padding: "10px" }}
              />

            </div>


            {/* QUANTITY */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Total Quantity
              </label>

              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                placeholder="Enter quantity"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                " style={{ padding: "10px" }}
              />

            </div>


            {/* AVAILABLE */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Available
              </label>

              <input
                type="number"
                min="0"
                value={available}
                onChange={(e) =>
                  setAvailable(e.target.value)
                }
                placeholder="Available books"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                " style={{ padding: "10px" }}
              />

            </div>

          </div>


          {/* DESCRIPTION */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Enter book description..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-slate-800
                outline-none
                transition
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
              " style={{ padding: "10px" }}
            />

          </div>


          {/* ================= BUTTONS ================= */}

          <div
            className="
              mt-7
              flex
              justify-end
              gap-3
              border-t
              border-slate-100
              pt-6
            "
          >

            {/* CANCEL */}

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-6
                py-3
                font-semibold
                text-slate-600
                transition
                hover:bg-slate-50
                disabled:opacity-50
              "style={{ padding: " 0px 20px" }}
            >
              Cancel
            </button>


            {/* UPDATE */}

            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-6
                py-3
                font-semibold
                text-white
                shadow-lg
                shadow-blue-600/20
                transition
                hover:bg-blue-700
                hover:-translate-y-0.5
                disabled:cursor-not-allowed
                disabled:opacity-60
              "style={{ padding: " 0px 20px" }}
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />

                  Update Book
                </>
              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}