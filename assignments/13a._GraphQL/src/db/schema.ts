import { relations } from "drizzle-orm";
import { foreignKey, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

const authorTable = sqliteTable("authors", {
  id: text("id").primaryKey(),
  name: text("name"),
});

const authorsRelation = relations(authorTable, ({ many }) => {
  return {
    books: many(booksTable),
  };
});

const booksTable = sqliteTable(
  "books",
  {
    id: text("id").primaryKey(),
    title: text("title"),
    releaseYear: int("release_year"),
    authorId: text("author_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.authorId],
      foreignColumns: [authorTable.id],
    }),
  ],
);

const booksRelation = relations(booksTable, ({ one }) => {
  return {
    author: one(authorTable, {
      fields: [booksTable.authorId],
      references: [authorTable.id],
    }),
  };
});

export { authorTable, authorsRelation, booksTable, booksRelation };
