import api from "@/lib/api";

export const IssueService = {
  async getIssues() {
    const { data } = await api.get("/issue-books");
    return data;
  },

  async issueBook(payload: any) {
    const { data } = await api.post(
      "/issue-books",
      payload
    );

    return data;
  },

  async updateIssue(id: string, payload: any) {
    const { data } = await api.put(
      `/issue-books/${id}`,
      payload
    );

    return data;
  },

  async deleteIssue(id: string) {
    const { data } = await api.delete(
      `/issue-books/${id}`
    );

    return data;
  },

  async returnBook(id: string) {
    const { data } = await api.put(
      `/issue-books/${id}`
    );

    return data;
  },
};