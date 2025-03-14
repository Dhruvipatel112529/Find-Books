import { useEffect, useState } from "react";
import { Bookcard } from "../components/Bookcard";
import { Searchbar } from "../components/Searchbar";
import Load from "./Load";
import "../components-css/Bookcard.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Book = () => {
  const [bookdata, setBookdata] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [newArrivals, setNewArrivals] = useState([]);
  const [comics, setComics] = useState([]);
  const [schoolBooks, setSchoolBooks] = useState([]);
  const [examBooks, setExamBooks] = useState([]);
  const [literature, setLiterature] = useState([]);
  const [religiousBooks, setReligiousBooks] = useState([]);
  const [resellBooks, setResellBooks] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = [
    "src/images/ai-generated-8266786_1280.png",
    "src/images/book.jpg",
    "src/images/wp2036900.jpg",
    // "src/images/library.jpg",
    // "src/images/bookshelf.jpg",
    // "src/images/reading-room.jpg",
    // "src/images/bookstore.jpg",
    // "src/images/classic-books.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const fetchBook = async () => {
    try {
      const res = await fetch("http://localhost:2606/api/Book");
      const data = await res.json();

      console.log("API Response:", data); // Debugging

      // Check if data is an array before filtering
      if (!Array.isArray(data)) {
        console.warn("Expected an array but got:", data);
        setBookdata([]); // Set empty array to avoid errors
        setLoading(false);
        return;
      }

      setBookdata(data);

      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      setNewArrivals(
        data.filter(
          (book) =>
            new Date(book.Publication_Date) > tenDaysAgo && !book.Isoldbook
        )
      );

      setComics(
        data.filter(
          (book) =>
            book.Subcategory_id === "679328219316fea7c66399b1" &&
            !book.Isoldbook
        )
      );

      setSchoolBooks(
        data.filter(
          (book) =>
            book.Subcategory_id === "679328219316fea7c66399b1" &&
            !book.Isoldbook
        )
      );

      setExamBooks(
        data.filter(
          (book) =>
            book.Subcategory_id === "679328219316fea7c66399b1" &&
            !book.Isoldbook
        )
      );

      setLiterature(
        data.filter(
          (book) =>
            book.Subcategory_id === "679328219316fea7c66399b1" &&
            !book.Isoldbook
        )
      );

      setReligiousBooks(
        data.filter(
          (book) =>
            book.Subcategory_id === "679328219316fea7c66399b1" &&
            !book.Isoldbook
        )
      );

      setResellBooks(data.filter((book) => book.Isoldbook));

      setLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error);
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
          <button className="slide-nav prev" onClick={prevSlide}>
            <ChevronLeft />
          </button>
          <div className="slideshow-wrapper">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className={`slideshow-image ${index === currentImageIndex ? 'active' : ''}`}
                style={{
                  transform: `translateX(${(index - currentImageIndex) * 100}%)`,
                  transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
                }}
              />
            ))}
          </div>
          <button className="slide-nav next" onClick={nextSlide}>
            <ChevronRight />
          </button>
          <div className="slide-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
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

          {comics.length > 0 && (
            <>
              <div className="booktype">Comics</div>
              <section className="card-container">
                <ul className="cards">
                  {comics.map((book) => (
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

          {examBooks.length > 0 && (
            <>
              <div className="booktype">Exam Books</div>
              <section className="card-container">
                <ul className="cards">
                  {examBooks.map((book) => (
                    <Bookcard key={book._id} book={book} />
                  ))}
                </ul>
              </section>
            </>
          )}

          {literature.length > 0 && (
            <>
              <div className="booktype">Literature</div>
              <section className="card-container">
                <ul className="cards">
                  {literature.map((book) => (
                    <Bookcard key={book._id} book={book} />
                  ))}
                </ul>
              </section>
            </>
          )}

          {religiousBooks.length > 0 && (
            <>
              <div className="booktype">Religious Books</div>
              <section className="card-container">
                <ul className="cards">
                  {religiousBooks.map((book) => (
                    <Bookcard key={book._id} book={book} />
                  ))}
                </ul>
              </section>
            </>
          )}

          {resellBooks.length > 0 && (
            <>
              <div className="booktype">Resell Books</div>
              <section className="card-container">
                <ul className="cards">
                  {resellBooks.map((book) => (
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
