import { useState, useEffect } from "react";
import "../pages-css/ManageBooks.css";
import { useNavigate } from "react-router-dom";


 export const ManageBooks= () => {
   const [search, setSearch] = useState("");
const [products, setProducts] = useState([]);

  const [bookdata, setBookdata] = useState([]);
  const navigate = useNavigate();

      const fetchBook = async () => {
          try {
              const res = await fetch("http://localhost:2606/api/Book");
              const data = await res.json();
              // console.log(data)
              setBookdata(data);
          } catch (error) {
              console.error(error);
              //setError(error);
          }
      };
  
      useEffect(() => {
          fetchBook();
      }, []);

      const redirectBook = () => {
        navigate("/Admin/ManageBooks/AddBook");
      }

   const handleSearch = (e) => {
     setSearch(e.target.value);
   };

   const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
  
    try {
      const response = await fetch("http://localhost:2606/api/Book", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: id }),
        credentials: "include",
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Book deleted successfully");
        setBookdata(bookdata.filter((book) => book._id !== id));
      } else {
        alert(result.error || "Failed to delete the book.");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("An error occurred while deleting the book.");
    }
  };
  

  const handleEdit = async (id) => {
    const newName = prompt("Enter new book name:");
    const newPrice = prompt("Enter new price:");
    const newISBN = prompt("Enter new ISBN:");
    const newAuthor = prompt("Enter new author:");
  
    if (!newName || !newPrice || !newISBN || !newAuthor) {
      alert("All fields are required!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:2606/api/Book", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: id,
          BookName: newName,
          Price: newPrice,
          ISBN: newISBN,
          Author: newAuthor,
        }),
        credentials: "include",
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Book updated successfully");
        setBookdata(
          bookdata.map((book) =>
            book._id === id
              ? { ...book, BookName: newName, Price: newPrice, ISBN: newISBN, Author: newAuthor }
              : book
          )
        );
      } else {
        alert(result.error || "Failed to update the book.");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      alert("An error occurred while updating the book.");
    }
  };
  

   const handleAddProduct = () => {
     const name = prompt("Enter product name:");
     const price = prompt("Enter product price:");
     const category = prompt("Enter product category:");
     if (name && price && category) {
       const newProduct = { id: products.length + 1, name, price, category };
       setProducts([...products, newProduct]);
     }
   };

   const filteredProducts = products.filter((product) =>
     product.name.toLowerCase().includes(search.toLowerCase())
   );

  return (
    <div className="products-page">
      <h1 className="title">Products Management</h1>
      <div className="books-card">
        <div className="card-content">
          <div className="header">
            <input
              type="text"
              placeholder="Search products..."
              // value={search}
              // onChange={handleSearch}
              className="search-input centered"
            />
            <button className="add-product centered" onClick={redirectBook}>Add Books</button>
          </div>
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>ISBN</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookdata.map((product,index) => (
                <tr key={product._id} className="product-row">
                  <td className="centered">{index+1}</td>
                  <td>
                      <img 
                      src={`http://localhost:2606/${product.BookImageURL}`} 
                      alt={product.BookName} 
                      className="bookImage" 
                      style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }}
                    />
                  </td>
                  <td className="centered">{product.BookName}</td>
                  <td className="centered">{product.Price}</td>
                  <td className="centered">{product.ISBN}</td>
                  <td className="centered">{product.Author}</td>
                  <td className="centered">
                    <div className="actions centered">
                      <button className="edit-btn centered" onClick={()=>{handleEdit(product._id)}}>Edit</button>
                      <button className="delete-btn centered" onClick={()=>{handleDelete(product._id)}} >Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
