import { Context } from "@getcronit/pylon";
import { eq } from "drizzle-orm";

import execute from "@/db/db";
import { booksTable } from "@/db/schema";
import { Book } from "@/schema";

type UpdateBook = {
  [k in keyof Book]?: Book[k];
};

class BookService {
  constructor() {
    this.getBooks = this.getBooks.bind(this);
    this.getBook = this.getBook.bind(this);
    this.createBook = this.createBook.bind(this);
    this.updateBook = this.updateBook.bind(this);
    this.deleteBook = this.deleteBook.bind(this);
  }

  async getBooks(c: Context) {
    const books = await execute(c.env.DB, (db) => {
      return db.query.booksTable.findMany({
        with: {
          author: true,
        },
      });
    });

    return books;
  }

  async getBook(c: Context, bookId: string) {
    const book = await execute(c.env.DB, (db) => {
      return db.query.booksTable.findFirst({
        where: (book, { eq }) => eq(book.id, bookId),
        with: {
          author: true,
        },
      });
    });

    return book;
  }

  async createBook(
    c: Context,
    newBook: Omit<typeof booksTable.$inferInsert, "id">,
  ) {
    const bookId = crypto.randomUUID();
    const [book] = await execute(c.env.DB, (db) => {
      return db
        .insert(booksTable)
        .values({ ...newBook, id: bookId })
        .returning();
    });

    return book;
  }

  async updateBook(
    c: Context,
    bookId: string,
    updatedBook: Omit<UpdateBook, "id">,
  ) {
    const [book] = await execute(c.env.DB, (db) => {
      return db
        .update(booksTable)
        .set(updatedBook)
        .where(eq(booksTable.id, bookId))
        .returning();
    });

    return book;
  }

  async deleteBook(c: Context, bookId: string) {
    const [book] = await execute(c.env.DB, (db) => {
      return db.delete(booksTable).where(eq(booksTable.id, bookId)).returning();
    });

    return book;
  }
}

const bookService = new BookService();
export default bookService;
