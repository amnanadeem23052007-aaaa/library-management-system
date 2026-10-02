import api from "@/lib/api";

export const BookService = {
  // Get All Books
  async getBooks(
    page = 1,
    limit = 10,
    search = "",
    category = "",
    sort = "latest"
  ) {
    const res = await api.get(
      `/books?page=${page}&limit=${limit}&search=${search}&category=${category}&sort=${sort}`
    );

    return res.data;
  },

  // Add Book
  async addBook(data: any) {
    const res = await api.post("/books", data);
    return res.data;
  },

  // Update Book
  async updateBook(id: string, data: any) {
    const res = await api.put(`/books/${id}`, data);
    return res.data;
  },

  // Delete Book
  async deleteBook(id: string) {
    const res = await api.delete(`/books/${id}`);
    return res.data;
  },
};