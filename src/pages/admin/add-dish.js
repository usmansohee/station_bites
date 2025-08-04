import { useState } from "react";
import axios from "axios";
import NormalToast from "../../util/Toast/NormalToast";
import { connectToDatabase } from "../../util/mongodb";
import getCategories from "../../util/getCategories";
import Head from "next/head";

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

      const response = await axios.post('/api/admin/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-session-id': sessionId
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      if (error.response?.status === 401) {
        NormalToast("Session expired. Please login again.", true);
        window.location.href = '/admin-login';
      } else {
        NormalToast("Image upload failed", true);
      }
      throw new Error('Image upload failed');
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
      // Upload image first
      const imageUrl = await uploadImage();
      
      // Add dish with uploaded image URL
      await axios.post("/api/admin/add-dish", {
        title,
        category,
        description,
        price,
        image: imageUrl,
      });

      NormalToast("Dish added successfully");
      setTitle("");
      setDescription("");
      setPrice("");
      setImageFile(null);
      setImagePreview("");
      setCategory("");
      setDisabled(false);
    } catch (err) {
      NormalToast("Something went wrong", true);
      console.error(err);
      setDisabled(false);
    }
  };

  return (
    <>
      <Head>
        <title>Station Bites | Add Dish</title>
      </Head>
      <div className="heightFixAdmin px-4 lg:py-4 sm:py-3 py-3 overflow-y-auto pb-20">
        <div className="mx-auto max-w-screen-sm sm:text-base text-sm">
          <h2 className="lg:text-2xl sm:text-xl text-lg font-bold mb-3">
            Add Dish
          </h2>
          <form onSubmit={formHandler} className="flex flex-col gap-2">
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
              className="bg-gray-100 border border-gray-200 py-2 px-3 rounded-md resize-none h-16 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              cols="25"
              rows="6"
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
            <div className="space-y-1">
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
                <div className="mt-1">
                  <p className="text-xs text-gray-600 mb-1">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-16 h-16 object-cover rounded-md border shadow-sm"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
              </p>
            </div>
            
            <button
              type="submit"
              className={`button py-2 px-8 sm:text-base text-sm mt-2 mb-4 ${disabled ? "opacity-50" : ""
                }`}
              disabled={disabled}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

AddDish.admin = true;
export default AddDish;

export const getStaticProps = async () => {
  const { db } = await connectToDatabase();
  let categories = await db.collection("categories").find({}).toArray();
  categories = JSON.parse(JSON.stringify(categories));
  return {
    props: {
      categories,
    },
    revalidate: 1,
  };
};
