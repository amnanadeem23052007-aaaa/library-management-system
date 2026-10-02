import api from "@/lib/api";
import { Member } from "@/types/member";

export const MemberService = {
  async getMembers() {
    const { data } = await api.get("/members");
    return data;
  },

  async createMember(
    member: Partial<Member>
  ) {
    const { data } = await api.post(
      "/members",
      member
    );

    return data;
  },

  async updateMember(
    id: string,
    member: Partial<Member>
  ) {
    const { data } = await api.put(
      `/members/${id}`,
      member
    );

    return data;
  },

  async deleteMember(id: string) {
    const { data } = await api.delete(
      `/members/${id}`
    );

    return data;
  },
};