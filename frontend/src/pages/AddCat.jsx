import { useState, useEffect } from "react";
import "../pages-css/AddCat.css";

export const AddCat = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:2606/api/Category");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:2606/api/Category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Category_Name: categoryName })
      });
      if (response.ok) {
        alert("Category added successfully!");
        setCategoryName("");
        fetchCategories();
      } else {
        alert("Failed to add category.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:2606/api/Subcategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Subcategory_Name: subcategoryName ,Category_id : selectedCategory })
      });
      if (response.ok) {
        alert("Subcategory added successfully!");
        setSubcategoryName("");
      } else {
        alert("Failed to add subcategory.");
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  return (
    <div className="admin-category-container">
      <h2 className="adminh2">Manage Categories & Subcategories</h2>
      
      <form onSubmit={handleAddCategory} className="category-form">
        <h3>Add Category</h3>
        <input
          type="text"
          placeholder="Enter Category Name"
          value={categoryName}
          className="catinput"
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <button type="submit" className="addcat">Add Category</button>
      </form>

      {/* Add Subcategory Form */}
      <form onSubmit={handleAddSubcategory} className="subcategory-form">
        <h3>Add Subcategory</h3>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.Category_Name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Enter Subcategory Name"
          value={subcategoryName}
          className="subinput"
          onChange={(e) => setSubcategoryName(e.target.value)}
          required
        />
        <button type="submit" className="addsubcat">Add Subcategory</button>
      </form>
    </div>
  );
};
