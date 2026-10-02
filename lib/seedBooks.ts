import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";
import Issue from "@/models/Issue";
import { books as initialBooks } from "@/data/books";

export interface SeedResult {
  success: boolean;
  message: string;
  inserted: number;
  updated: number;
  unchanged: number;
  totalBooks: number;
  distinctCategories: number;
}

export async function seedBooksDatabase(): Promise<SeedResult> {
  await connectDB();

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;

  for (const item of initialBooks) {
    // 1. Try finding by ISBN or exact category
    const existingBook = await Book.findOne({
      $or: [{ isbn: item.isbn }, { category: item.category }],
    });

    if (existingBook) {
      // Calculate real available count based on active issues
      const activeIssuesCount = await Issue.countDocuments({
        book: existingBook._id,
        status: { $in: ["issued", "overdue"] },
      });

      const targetQuantity = item.quantity || 5;
      const targetAvailable = Math.max(0, targetQuantity - activeIssuesCount);

      // Check if update is needed (e.g. placeholder dummy data being replaced)
      const needsUpdate =
        existingBook.title !== item.title ||
        existingBook.author !== item.author ||
        existingBook.category !== item.category ||
        existingBook.isbn !== item.isbn ||
        existingBook.quantity !== targetQuantity ||
        existingBook.available !== targetAvailable ||
        !existingBook.description;

      if (needsUpdate) {
        existingBook.title = item.title;
        existingBook.author = item.author;
        existingBook.category = item.category;
        existingBook.isbn = item.isbn;
        existingBook.quantity = targetQuantity;
        existingBook.available = targetAvailable;
        existingBook.rating = item.rating || 5;
        existingBook.totalRatings = item.totalRatings || 25;
        existingBook.description = item.description || "";
        existingBook.coverImage = item.coverImage || "";

        await existingBook.save();
        updated++;
      } else {
        unchanged++;
      }
    } else {
      // 2. Book does not exist - insert safely
      await Book.create({
        title: item.title,
        author: item.author,
        category: item.category,
        isbn: item.isbn,
        quantity: item.quantity || 5,
        available: item.available || 5,
        rating: item.rating || 5,
        totalRatings: item.totalRatings || 25,
        description: item.description || "",
        coverImage: item.coverImage || "",
      });
      inserted++;
    }
  }

  // Normalize legacy categories if they exist (without deleting books or issues)
  const legacyMap: Record<string, string> = {
    Isalm: "General Knowledge",
    IT: "Information Technology",
    Database: "Database Systems",
  };

  for (const [oldCat, newCat] of Object.entries(legacyMap)) {
    await Book.updateMany(
      { category: oldCat },
      { $set: { category: newCat } }
    );
  }

  const totalBooks = await Book.countDocuments();
  const distinctCategories = (await Book.distinct("category")).length;

  return {
    success: true,
    message: `Database seeding completed: ${inserted} inserted, ${updated} updated, ${unchanged} unchanged.`,
    inserted,
    updated,
    unchanged,
    totalBooks,
    distinctCategories,
  };
}
