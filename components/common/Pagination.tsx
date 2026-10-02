"use client";

interface Props {
  currentPage?: number;
  totalPages?: number;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 10,
}: Props) {
  return (
    <div className="flex justify-between items-center mt-8">

      <p className="text-gray-500">
        Page <strong>{currentPage}</strong> of{" "}
        <strong>{totalPages}</strong>
      </p>

      <div className="flex gap-3">

        <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
          Previous
        </button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-lg ${currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "border hover:bg-gray-100"
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
          Next
        </button>

      </div>

    </div>
  );
}