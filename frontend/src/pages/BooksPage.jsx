import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../components-css/BookCard.css";
import { Navbar } from "../components/Navbar";
import Load from "../components/Load";
import { Bookcard } from "../components/Bookcard";

export const BooksPage = () => {
  const { subcategory } = useParams();
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `http://localhost:2606/api/${subcategory}/Books`
        );
        const data = await response.json();
        setBook(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, [subcategory]);

  if (loading) {
    return (
      <div>
        <h1>
          <Load />
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="bookpage-div">
        <section className="card-container">
          <div className="booktype">
            <h1>{subcategory}</h1>
          </div>
          <div>
            <ul className="cards">
              {book.length <= 0 ? (
                <div className="nobooks">
                  <h4>No Books In the Stock</h4>
                </div>
              ) : (
                book.map((book) => <Bookcard key={book._id} book={book} />)
              )}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
};
