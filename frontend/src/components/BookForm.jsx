import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components-css/BookForm.css";

export const BookForm = ({ UserRole }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    BookName: "",
    image: null,
    Author: "",
    Edition: "",
    Publication_Date: "",
    Publisher: "",
    Description: "",
    Price: "",
    ISBN: "",
    Condition: "",
    Category: "",
    SubCategory: ""
  });

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:2606/api/Category");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle category change and fetch subcategories
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setFormData((prev) => ({ ...prev, Category: categoryId, SubCategory: "" }));
    setErrors((prevErrors) => ({ ...prevErrors, Category: "" })); // Clear errors

    try {
      const response = await fetch(`http://localhost:2606/api/${categoryId}/Subcategory`);
      const data = await response.json();
      setSubcategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear errors
  };

  // Handle file input changes
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validation
    if (!formData.BookName.trim()) newErrors.BookName = "Book Name is required";
    if (!formData.image) newErrors.image = "Book image is required";
    if (!formData.Author.trim()) newErrors.Author = "Author is required";
    if (!formData.Publication_Date) newErrors.Publication_Date = "Publication Date is required";
    if (!formData.Publisher.trim()) newErrors.Publisher = "Publisher is required";
    if (!formData.Description.trim()) newErrors.Description = "Description is required";
    if (!formData.Price || formData.Price <= 0) newErrors.Price = "Price must be greater than 0";
    if (!formData.ISBN.trim()) newErrors.ISBN = "ISBN is required";
    if (formData.ISBN.length !== 13) newErrors.ISBN = "ISBN code must be 13 digits";
    if (!formData.Condition) newErrors.Condition = "Condition is required";
    if (!formData.Category) newErrors.Category = "Category is required";
    if (!formData.SubCategory) newErrors.SubCategory = "Subcategory is required";

    setErrors(newErrors);

    // If there are no errors, navigate to the next page with form data
    if (Object.keys(newErrors).length === 0) {
      navigate("/ResellerPaymentForm", { state: { bookData: formData, UserRole } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="resellerbookform">
      <label>Book Name</label>
      <input type="text" name="BookName" value={formData.BookName} onChange={handleChange} />
      {errors.BookName && <p className="error-message">{errors.BookName}</p>}

      <label>Book Image</label>
      <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
      {formData.image && (
        <img src={URL.createObjectURL(formData.image)} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px" }} />
      )}
      {errors.image && <p className="error-message">{errors.image}</p>}

      <label>Author</label>
      <input type="text" name="Author" value={formData.Author} onChange={handleChange} />
      {errors.Author && <p className="error-message">{errors.Author}</p>}

      <label>Publication Date</label>
      <input type="date" name="Publication_Date" value={formData.Publication_Date} onChange={handleChange} />
      {errors.Publication_Date && <p className="error-message">{errors.Publication_Date}</p>}

      <label>Edition</label>
      <input type="text" name="Edition" value={formData.Edition} onChange={handleChange} />

      <label>Publisher</label>
      <input type="text" name="Publisher" value={formData.Publisher} onChange={handleChange} />
      {errors.Publisher && <p className="error-message">{errors.Publisher}</p>}

      <label>Description</label>
      <textarea name="Description" value={formData.Description} onChange={handleChange} />
      {errors.Description && <p className="error-message">{errors.Description}</p>}

      <label>Price</label>
      <input type="number" name="Price" value={formData.Price} onChange={handleChange} />
      {errors.Price && <p className="error-message">{errors.Price}</p>}

      <label>ISBN No</label>
      <input type="text" name="ISBN" value={formData.ISBN} onChange={handleChange} />
      {errors.ISBN && <p className="error-message">{errors.ISBN}</p>}

      <label>Condition</label>
      <select name="Condition" value={formData.Condition} onChange={handleChange}>
        <option value="">Select Condition</option>
        <option value="fair">Fair</option>
        <option value="excellent">Excellent</option>
        <option value="good">Good</option>
      </select>
      {errors.Condition && <p className="error-message">{errors.Condition}</p>}

      <label>Category</label>
      <select name="Category" value={formData.Category} onChange={handleCategoryChange}>
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>{category.Category_Name}</option>
        ))}
      </select>
      {errors.Category && <p className="error-message">{errors.Category}</p>}

      <label>Subcategory</label>
      <select name="SubCategory" value={formData.SubCategory} onChange={handleChange}>
        <option value="">Select Subcategory</option>
        {subcategories.map((subcategory) => (
          <option key={subcategory._id} value={subcategory._id}>{subcategory.Subcategory_Name}</option>
        ))}
      </select>
      {errors.SubCategory && <p className="error-message">{errors.SubCategory}</p>}

      <button type="submit" className="resellerbook-btn">Next Page</button>
    </form>
  );
};