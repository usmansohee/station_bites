import { useState } from "react";
import axios from "axios";
import NormalToast from "../../util/Toast/NormalToast";
import Head from "next/head";

function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [disabled, setDisabled] = useState(false);

  const formHandler = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!categoryName.trim()) {
      NormalToast("Please enter a category name", true);
      return;
    }
    
    setDisabled(true);
    
    try {
      // Get session ID from localStorage
      const sessionId = localStorage.getItem("adminSessionId");
      
      if (!sessionId) {
        NormalToast("Session expired. Please login again.", true);
        return;
      }
      
      const response = await axios.post("/api/admin/add-category", { 
        name: categoryName.trim() 
      }, {
        headers: {
          'x-session-id': sessionId
        }
      });
      
      if (response.status === 200) {
        NormalToast("Category added successfully");
        setCategoryName("");
      } else {
        NormalToast("Failed to add category", true);
      }
    } catch (err) {
      console.error("Error adding category:", err);
      
      if (err.response?.status === 401) {
        NormalToast("Session expired. Please login again.", true);
        // Redirect to login
        window.location.href = '/admin-login';
      } else if (err.response?.data?.message) {
        NormalToast(err.response.data.message, true);
      } else {
        NormalToast("Something went wrong", true);
      }
    } finally {
      setDisabled(false);
    }
  };

  return (
    <>
      <Head>
        <title>3 in 1 Tandoori Chicken | Add Category</title>
      </Head>
      <div className="heightFixAdmin px-4 lg:py-6 sm:py-4 py-4 overflow-y-auto">
        <div className="mx-auto max-w-screen-sm sm:text-base text-sm">
          <h2 className="lg:text-3xl sm:text-2xl text-xl font-bold mb-4">
            Add Category
          </h2>
          <form onSubmit={formHandler} className="flex flex-col gap-4">
            <input
              type="text"
              required
              placeholder="Enter category name"
              className="bg-gray-100 py-2 border border-gray-200 px-3 rounded-md outline-none"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              disabled={disabled}
              minLength="2"
              maxLength="50"
            />
            <button
              className={`button py-2 px-8 sm:text-base text-sm mt-3 mb-4 ${disabled ? "opacity-50" : ""
                }`}
              type="submit"
              disabled={disabled}
            >
              {disabled ? "Adding..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

AddCategory.admin = true;
export default AddCategory;
