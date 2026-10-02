"use client";

import { useEffect, useState } from "react";

export default function useDeletedMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchDeletedMembers() {
    try {
      setLoading(true);

      const res = await fetch("/api/deleted-members");

      const data = await res.json();

      if (data.success) {
        setMembers(data.members || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDeletedMembers();
  }, []);

  return {
    members,
    loading,
    fetchDeletedMembers,
  };
}