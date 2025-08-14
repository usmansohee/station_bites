import { useState } from "react";
import axios from "axios";
import NormalToast from "../../util/Toast/NormalToast";
import { connectToDatabase } from "../../util/mongodb";
import getCategories from "../../util/getCategories";
import Head from "next/head";
import { useRouter } from "next/router";

function AddDish(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [category, setCategory] = useState(props?.categories[0]?.name);
  const { categories, error } = getCategories(props?.categories);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  if (error) {
    console.error(error);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        NormalToast("Please select an image file only", true);
        e.target.value = '';
        return;
      }
      
      // Validate file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        NormalToast("File size must be less than 5MB", true);
        e.target.value = '';
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) {
      NormalToast("Please select an image file", true);
      throw new Error('No image selected');
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      // Get session ID from localStorage
      const sessionId = localStorage.getItem("adminSessionId");
      
      if (!sessionId) {
        NormalToast("Session expired. Please login again.", true);
        throw new Error('No session');
      }

      console.log("Uploading image with session ID:", sessionId);
      console.log("Image file:", imageFile);

      const response = await axios.post('/api/admin/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-session-id': sessionId
        },
      });
      
      console.log("Upload response:", response.data);
      return response.data.imageUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        NormalToast("Session expired. Please login again.", true);
        window.location.href = '/admin-login';
      } else if (error.response?.data?.message) {
        NormalToast(error.response.data.message, true);
      } else {
        NormalToast("Image upload failed", true);
      }
      throw new Error('Image upload failed');
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setImageFile(null);
    setImagePreview("");
    setCategory(props?.categories[0]?.name || "");
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      NormalToast("Please select an image file", true);
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

      console.log("Starting form submission with session ID:", sessionId);

      // Upload image first
      const imageUrl = await uploadImage();
      console.log("Image uploaded successfully:", imageUrl);
      
      // Add dish with uploaded image URL
      const dishData = {
        title,
        category,
        description,
        price,
        image: imageUrl,
      };
      
      console.log("Submitting dish data:", dishData);
      
      const response = await axios.post("/api/admin/add-dish", dishData, {
        headers: {
          'x-session-id': sessionId
        }
      });

      console.log("Add dish response:", response.data);

      NormalToast("Dish added successfully");
      
      // Clear the form
      clearForm();
      
      // Redirect to dishes page after a short delay
      setTimeout(() => {
        router.push('/admin/dishes');
      }, 1000);
      
    } catch (err) {
      console.error("Error adding dish:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      if (err.response?.status === 401) {
        NormalToast("Session expired. Please login again.", true);
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
        <title>3 in 1 Hot Tandoori Chicken | Add Dish</title>
      </Head>
      <div className="heightFixAdmin px-4 lg:py-6 sm:py-4 py-4 overflow-y-auto">
        <div className="mx-auto max-w-screen-sm sm:text-base text-sm">
          <h2 className="lg:text-3xl sm:text-2xl text-xl font-bold mb-4">
            Add Dish
          </h2>
          <form onSubmit={formHandler} className="flex flex-col gap-4">
            <input
              type="text"
              required
              value={title}
              placeholder="Title"
              className="bg-gray-100 py-2 px-3 rounded-md outline-none border border-gray-200"
              onChange={(e) => setTitle(e.target.value)}
              disabled={disabled}
            />
            <select
              required
              className="bg-gray-100 py-2 px-3 rounded-md outline-none border border-gray-200 capitalize"
              onChange={(e) => setCategory(e.target.value)}
              disabled={disabled}
              value={category}
            >
              {categories?.map((category) => (
                <option value={category?.name} key={`option-${category?._id}`}>
                  {category?.name}
                </option>
              ))}
            </select>
            <textarea
              required
              placeholder="Description"
              className="bg-gray-100 border border-gray-200 py-2 px-3 rounded-md resize-none h-20 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              cols="25"
              rows="8"
              disabled={disabled}
            ></textarea>
            <input
              type="number"
              required
              placeholder="Price"
              className="bg-gray-100 border py-2 px-3 rounded-md outline-none border-gray-200"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={disabled}
            />
            
            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Dish Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-gray-100 py-2 px-3 rounded-md outline-none border border-gray-200 cursor-pointer"
                disabled={disabled}
                required
              />
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-md border shadow-sm"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
              </p>
            </div>
            
            <button
              type="submit"
              className={`button py-2 px-8 sm:text-base text-sm mt-3 mb-4 ${disabled ? "opacity-50" : ""
                }`}
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

AddDish.admin = true;
export default AddDish;

export const getServerSideProps = async () => {
  try {
    const { db } = await connectToDatabase();
    let categories = await db.collection("categories").find({}).toArray();
    categories = JSON.parse(JSON.stringify(categories));
    return {
      props: {
        categories,
      },
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      props: {
        categories: [],
      },
    };
  }
};
