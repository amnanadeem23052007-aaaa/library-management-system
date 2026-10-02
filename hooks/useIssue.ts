"use client";

import { useEffect, useState } from "react";
import { IssueService } from "@/services/issue.service";

export default function useIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    setLoading(true);

    try {
      const data = await IssueService.getIssues();

      setIssues(data.issues || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return {
    issues,
    loading,
    fetchIssues,
  };
}