import { getContext } from "@getcronit/pylon";
import booksService from "@/services/booksService";
import { Book } from "@/schema";

const queryResolvers = {
  books: (): Promise<Book[]> => {
    const c = getContext();

    return booksService.getBooks(c);
  },
  book: (id: string): Promise<Book | undefined> => {
    const c = getContext();

    return booksService.getBook(c, id);
  },
};

const mutationResolvers = {
  createBook: (
    authorId: string,
    title: string,
    releaseYear?: number,
  ): Promise<Book> => {
    const c = getContext();

    return booksService.createBook(c, { authorId, title, releaseYear });
  },
  updateBook: (
    id: string,
    authorId?: string,
    title?: string,
    releaseYear?: number,
  ): Promise<Book> => {
    const c = getContext();

    return booksService.updateBook(c, id, { authorId, title, releaseYear });
  },
  deleteBook: (id: string): Promise<Book> => {
    const c = getContext();

    return booksService.deleteBook(c, id);
  },
};

export { mutationResolvers, queryResolvers };
