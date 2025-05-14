import { Context } from "@getcronit/pylon";
import { eq } from "drizzle-orm";

import execute from "@/db/db";
import { authorTable } from "@/db/schema";
import { Author } from "@/schema";

type UpdateAuthor = {
  [k in keyof Author]?: Author[k];
};

class AuthorService {
  constructor() {
    this.getAuthors = this.getAuthors.bind(this);
    this.getAuthor = this.getAuthor.bind(this);
    this.createAuthor = this.createAuthor.bind(this);
    this.updateAuthor = this.updateAuthor.bind(this);
    this.deleteAuthor = this.deleteAuthor.bind(this);
  }

  async getAuthors(c: Context) {
    const authors = await execute(c.env.DB, (db) => {
      return db.query.authorTable.findMany({
        with: {
          books: true,
        },
      });
    });

    return authors;
  }

  async getAuthor(c: Context, authorId: string) {
    const author = await execute(c.env.DB, (db) => {
      return db.query.authorTable.findFirst({
        where: (author, { eq }) => eq(author.id, authorId),
        with: {
          books: true,
        },
      });
    });

    return author;
  }

  async createAuthor(
    c: Context,
    newAuthor: Omit<typeof authorTable.$inferInsert, "id">,
  ) {
    const authorId = crypto.randomUUID();
    const [author] = await execute(c.env.DB, (db) => {
      return db
        .insert(authorTable)
        .values({ ...newAuthor, id: authorId })
        .returning();
    });

    return author;
  }

  async updateAuthor(
    c: Context,
    authorId: string,
    updatedAuthor: Omit<UpdateAuthor, "id">,
  ) {
    const [author] = await execute(c.env.DB, (db) => {
      return db
        .update(authorTable)
        .set(updatedAuthor)
        .where(eq(authorTable.id, authorId))
        .returning();
    });

    return author;
  }

  async deleteAuthor(c: Context, authorId: string) {
    const [author] = await execute(c.env.DB, (db) => {
      return db
        .delete(authorTable)
        .where(eq(authorTable.id, authorId))
        .returning();
    });

    return author;
  }
}

const authorService = new AuthorService();
export default authorService;
