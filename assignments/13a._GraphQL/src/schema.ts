import { authorTable, booksTable } from "./db/schema";

type Book = typeof booksTable.$inferSelect & { author?: Author };

type Author = typeof authorTable.$inferSelect & { books: Book[] };

type ErrorMessage = {
  message: string;
  errorCode: number;
};

type SuccessMessage = {
  message: string;
};

export { Book, Author, ErrorMessage, SuccessMessage };
