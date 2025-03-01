import { useEffect, useState } from "react";
import { Bookcard } from "../components/Bookcard";
import { Searchbar } from "../components/Searchbar";
import Load from "./Load";
import "../components-css/Bookcard.css";

export const Book = () => {
  const [bookdata, setBookdata] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [newArrivals, setNewArrivals] = useState([]);
  const [Icomics, setIcomics] = useState([]);
  const [schoolBooks, setschoolBooks] = useState([]);
  const [Resell, setResell] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "src/images/ai-generated-8266786_1280.png",
    "src/images/book.jpg",
    "src/images/wp2036900.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchBook = async () => {
    try {
      const res = await fetch("http://localhost:2606/api/Book");
      const data = await res.json();
      setBookdata(data);

      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      if (data) {
        setNewArrivals(
          data.filter(
            (book) =>
              new Date(book.Publication_Date) > tenDaysAgo && !book.Isoldbook
          )
        );
        setIcomics(
          data.filter(
            (book) =>
              book.Subcategory_id === "6793288e9316fea7c66399b7" &&
              !book.Isoldbook
          )
        );
        setschoolBooks(
          data.filter(
            (book) =>
              book.Subcategory_id === "679329039316fea7c66399ba" &&
              !book.Isoldbook
          )
        );
        setResell(data.filter((book) => book.Isoldbook));
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const handleSearch = () => {
    setFilteredBooks(
      bookdata.filter((curBook) =>
        curBook.BookName.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  if (loading)
    return (
      <h1>
        <Load />
      </h1>
    );
  if (error) return <h1>{error.message}</h1>;

  return (
    <>
      <div className="image">
        <div className="slideshow-container">
          <img
            src={images[currentImageIndex]}
            alt="Slideshow"
            className="slideshow-image"
          />
        </div>
        <Searchbar
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />
      </div>

      {filteredBooks.length === 0 ? (
        <>
          {newArrivals.length > 0 && (
            <>
              <div className="booktype">New Arrival</div>
              <section className="card-container">
                <ul className="cards">
                  {newArrivals.map((book) => (
                    <Bookcard key={book._id} book={book} />
                  ))}
                </ul>
              </section>
            </>
          )}

          {Icomics.length > 0 && (
            <>
              <div className="booktype">Comics</div>
              <section className="card-container">
                <ul className="cards">
                  {Icomics.map((book) => (
                    <Bookcard key={book._id} book={book} />
                  ))}
                </ul>
              </section>
            </>
          )}

          {schoolBooks.length > 0 && (
            <>
              <div className="booktype">School Books</div>
              <section className="card-container">
                <ul className="cards">
                  {schoolBooks.map((book) => (
                    <Bookcard key={book._id} book={book} />
                  ))}
                </ul>
              </section>
            </>
          )}

          {Resell.length > 0 && (
            <>
              <div className="booktype">Resell Books</div>
              <section className="card-container">
                <ul className="cards">
                  {Resell.map((book) => (
                    <Bookcard key={book._id} book={book} />
                  ))}
                </ul>
              </section>
            </>
          )}
        </>
      ) : (
        <section className="card-container">
          <ul className="cards">
            {filteredBooks.map((book) => (
              <Bookcard key={book._id} book={book} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
};
