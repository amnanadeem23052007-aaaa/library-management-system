"use client";

import { useEffect, useState } from "react";
import { MemberService } from "@/services/member.service";

export default function useMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const data = await MemberService.getMembers();

      setMembers(data.members || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    fetchMembers,
  };
}