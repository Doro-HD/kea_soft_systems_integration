import { getContext } from "@getcronit/pylon";
import authorService from "@/services/authorsService";
import { Author } from "@/schema";

const queryResolvers = {
  authors: (): Promise<Author[]> => {
    const c = getContext();

    return authorService.getAuthors(c);
  },
  author: (id: string): Promise<Author | undefined> => {
    const c = getContext();

    return authorService.getAuthor(c, id);
  },
};

const mutationResolvers = {
  createAuthor: (name: string): Promise<Author> => {
    const c = getContext();

    return authorService.createAuthor(c, { name });
  },
  updateBook: (id: string, name: string): Promise<Author> => {
    const c = getContext();

    return authorService.updateAuthor(c, id, { name });
  },
  deleteBook: (id: string): Promise<Author> => {
    const c = getContext();

    return authorService.deleteAuthor(c, id);
  },
};

export { mutationResolvers, queryResolvers };
