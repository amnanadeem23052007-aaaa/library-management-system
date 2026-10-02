"use client";

import { useEffect, useState } from "react";

export default function useReturn() {
  const [returnedBooks, setReturnedBooks] = useState<any[]>([]);
  const [issuedBooks, setIssuedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchReturnedBooks() {
    try {
      setLoading(true);

      const res = await fetch("/api/return-books");

      const data = await res.json();

      if (data.success) {
        setReturnedBooks(data.returnedBooks || []);
        setIssuedBooks(data.issuedBooks || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReturnedBooks();
  }, []);

  return {
    returnedBooks,
    issuedBooks,
    loading,
    fetchReturnedBooks,
  };
}