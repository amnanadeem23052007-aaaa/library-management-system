import api from "@/lib/api";

export const DashboardService = {
  async getDashboard() {
    const books = await api.get("/books");

    const members = await api.get("/members");

    const issues = await api.get("/issues");

    return {
      totalBooks: books.data.totalBooks,

      totalMembers: members.data.members.length,

      issuedBooks: issues.data.issues?.filter(
        (i: any) => i.status === "issued"
      ).length,

      returnedBooks: issues.data.issues?.filter(
        (i: any) => i.status === "returned"
      ).length,
    };
  },
};