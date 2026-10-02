"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export default function useBooks(initialLimit = 10) {
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(initialLimit);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [search]);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (debouncedSearch.trim()) {
        params.set("search", debouncedSearch.trim());
      }

      if (category) {
        params.set("category", category);
      }

      const res = await fetch(`/api/books?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();

      setBooks(data.books || []);
      setTotalPages(data.totalPages || 1);
      setTotalBooks(data.totalBooks || 0);

      if (Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("useBooks fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, category]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Initial category list fetch
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/books/categories");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to load categories in useBooks:", err);
      }
    }
    loadCategories();
  }, []);

  return {
    books,
    categories,
    loading,
    page,
    totalPages,
    totalBooks,
    search,
    category,
    limit,
    setPage,
    setSearch,
    setCategory,
    setLimit,
    fetchBooks,
  };
}