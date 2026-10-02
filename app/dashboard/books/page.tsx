import BookTable from "@/components/books/BookTable";

export default function BooksPage() {
  return (
    <div className="space-y-8" style={{ padding: "15px" }}>
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ padding: "10px" }}>
          Books
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400" style={{ padding: "10px" }}>
          Manage all library books — add, edit, delete, and track availability.
        </p>
      </div>

      <BookTable />
    </div>
  );
}