import api from "@/lib/api";

export const ReturnService = {
  async getReturnedBooks() {
    const { data } = await api.get("/return-books");
    return data;
  },

  async returnBook(payload: any) {
    const { data } = await api.put(
      "/return-books",
      payload
    );

    return data;
  },
};