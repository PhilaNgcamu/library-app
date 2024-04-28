import actionTypes from "./actionTypes";

// export const searchBook = (query) => {
//   return async (dispatch) => {
//     try {
//       const response = await fetch(
//         `https://www.googleapis.com/books/v1/volumes?q=${query}`
//       );
//       const data = await response.json();
//       console.log(JSON.stringify(data.items[0].volumeInfo, null, 2));

//       const { title, authors, categories } = data.items[0].volumeInfo;
//       const { id } = data.items[0];

//       console.log(data.items[0]);

//       //  console.log(title, authors, categories);

//       dispatch(addBook(id, title, authors[0], categories[0]));
//     } catch (error) {
//       console.error("Error searching book:", error);
//     }
//   };
// };

const fetchGenresFromWikipedia = async (title) => {
  try {
    // Replace spaces in the title with underscores for the Wikipedia API query
    const formattedTitle = title.replace(/\s/g, "_");
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodedTitle}`
    );
    const data = await response.json();

    // Extract genres or categories from the Wikipedia page summary
    const genres = data.categories.map((category) => category.title);

    return genres;
  } catch (error) {
    console.error("Error fetching genres from Wikipedia:", error);
    return [];
  }
};

// Action creator to search for a book and fetch genres from Wikipedia
export const searchBook = (query) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      const data = await response.json();

      // Fetch genres from Wikipedia for each book
      const booksWithGenres = await Promise.all(
        data.items.map(async (book) => {
          const genres = await fetchGenresFromWikipedia(book.volumeInfo.title);
          // return {
          //   ...book,
          //   genre: genres.length > 0 ? genres.join(", ") : "Unknown",
          // };
        })
      );

      const { title, authors, categories } = data.items[0].volumeInfo;
      const { id } = data.items[0];

      // console.log(data.items[0]);

      //  console.log(title, authors, categories);

      // console.log(booksWithGenres);

      // dispatch(addBook(id, title, authors[0], booksWithGenres));
    } catch (error) {
      console.error("Error searching book:", error);
    }
  };
};

export const addBook = (id, title, author, genre) => ({
  type: actionTypes.ADD_BOOK,
  payload: { id, title, author, genre },
});

export const setEditingBookId = (id) => ({
  type: actionTypes.SET_EDITING_BOOK_ID,
  payload: { id },
});

export const updateBookDetails = (bookId, title, author, genre) => ({
  type: actionTypes.UPDATE_BOOK_DETAILS,
  payload: { bookId, title, author, genre },
});

export const deleteBook = (id) => ({
  type: actionTypes.DELETE_BOOK,
  payload: { id },
});

export const getAllBooks = () => ({
  type: actionTypes.GET_ALL_BOOKS,
});

export const getAllBorrowings = () => ({
  type: actionTypes.GET_ALL_BORROWINGS,
});

export const setTitle = (title) => ({
  type: actionTypes.SET_TITLE,
  payload: { title },
});

export const setAuthor = (author) => ({
  type: actionTypes.SET_AUTHOR,
  payload: { author },
});

export const setGenre = (genre) => ({
  type: actionTypes.SET_GENRE,
  payload: { genre },
});
