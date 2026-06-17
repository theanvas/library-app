import React, { useState, useEffect } from "react";

function App() {

  const [books, setBooks] = useState([]); // Prazno na početku

    useEffect(() => {
    fetch("http://localhost:5267/api/library")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);


  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    year: "",
    rating: "",
  });

  const [editingBook, setEditingBook] = useState(null);


  const handleAddBook = (e) => {
    e.preventDefault();

    const bookToAdd = {
    Title: newBook.title,
    Author: newBook.author,
    Year: newBook.year.toString(),
    Rating: parseFloat(newBook.rating)
  };
    //console.log("Sending book:", bookToAdd);

    fetch("http://localhost:5267/api/library", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookToAdd),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add book");
        return res.json();
      })
      .then((addedBook) => {
        setBooks([...books, addedBook]);
        setNewBook({ title: "", author: "", year: "", rating: "" });
      })
      .catch((error) => console.error("Error adding book:", error));
};


  const handleDeleteBook = (id) => {
  fetch(`http://localhost:5267/api/library/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to delete book");
      setBooks(books.filter((book) => book.id !== id));
    })
    .catch((error) => console.error("Error deleting book:", error));
};



  // Otvaranje forme za izmenu knjige
  const handleEditBook = (book) => {
    setEditingBook({
      ...book,
      Year: book.year.toString(),
      Rating: book.rating.toString(),
    });
  };


  // Promena u formi za izmenu
  const handleEditInputChange = (e) => {
    setEditingBook({ ...editingBook, [e.target.name]: e.target.value });
  };


  const handleSaveEdit = (e) => {
  e.preventDefault();

  const updatedBook = {
    Id: editingBook.id,
    Title: editingBook.title,
    Author: editingBook.author,
    Year: editingBook.year.toString(),
    Rating: parseFloat(editingBook.rating),
  };

 // console.log(updatedBook);

  fetch(`http://localhost:5267/api/library/${updatedBook.Id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedBook),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to update book");
      return res.json();
    })
    .then((data) => {
      setBooks(books.map((b) => (b.id === data.id ? data : b)));
      setEditingBook(null);
    })
    .catch((error) => console.error("Error updating book:", error));
};

  const handleCancelEdit = () => {
    setEditingBook(null);
  };


  const handleResetForm = () => {
    setNewBook({ title: "", author: "", year: "", rating: "" });
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "700px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>📚 Moja biblioteka</h1>

      <h2>Spisak knjiga:</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {books.map((book) => (
          <li
            key={book.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <strong>{book.title}</strong> — {book.author} <br />
            Godina: {book.year} <br />
            Ocena: {book.rating.toFixed(1)}/5
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => handleEditBook(book)}
                style={{
                  padding: "5px 10px",
                  marginRight: "10px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Izmeni
              </button>
              <button
                onClick={() => handleDeleteBook(book.id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Obriši
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Forma za izmenu */}
      {editingBook && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #2196F3",
            borderRadius: "8px",
            backgroundColor: "#e3f2fd",
          }}
        >
          <h2>Izmeni knjigu:</h2>
          <form onSubmit={handleSaveEdit}>
            <div>
              <input
                type="text"
                name="title"
                placeholder="Naslov"
                value={editingBook.title}
                onChange={handleEditInputChange}
                required
                style={{ padding: "8px", marginBottom: "10px", width: "90%" }}
              />
            </div>
            <div>
              <input
                type="text"
                name="author"
                placeholder="Autor"
                value={editingBook.author}
                onChange={handleEditInputChange}
                required
                style={{ padding: "8px", marginBottom: "10px", width: "90%" }}
              />
            </div>
            <div>
              <input
                type="number"
                name="year"
                placeholder="Godina"
                value={editingBook.year}
                onChange={handleEditInputChange}
                required
                style={{ padding: "8px", marginBottom: "10px", width: "90%" }}
              />
            </div>
            <div>
              <input
                type="number"
                name="rating"
                placeholder="Ocena (0-5)"
                min="0"
                max="5"
                step="0.1"
                value={editingBook.rating}
                onChange={handleEditInputChange}
                required
                style={{ padding: "8px", marginBottom: "10px", width: "90%" }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                marginRight: "10px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Sačuvaj izmene
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                padding: "10px 20px",
                backgroundColor: "#9E9E9E",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Otkaži
            </button>
          </form>
        </div>
      )}

      <h2 style={{ marginTop: "40px" }}>Dodaj novu knjigu:</h2>
      <form onSubmit={handleAddBook}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Naslov"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
            style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
          />
        </div>
        <div>
          <input
            type="text"
            name="author"
            placeholder="Autor"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
            style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
          />
        </div>
        <div>
          <input
            type="number"
            name="year"
            placeholder="Godina"
            value={newBook.year}
            onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
            required
            style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
          />
        </div>
        <div>
          <input
            type="number"
            name="rating"
            placeholder="Ocena (0-5)"
            min="0"
            max="5"
            step="0.1"
            value={newBook.rating}
            onChange={(e) => setNewBook({ ...newBook, rating: e.target.value })}
            required
            style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Dodaj knjigu
        </button>
        <button
          type="button"
          onClick={handleResetForm}
          style={{
            padding: "10px 20px",
            backgroundColor: "#9E9E9E",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </form>
    </div>
  );
}

export default App;

