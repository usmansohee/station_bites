import { useState, useEffect } from "react";
import { formatCurrency } from "../../util/currencyFormatter";
import { useRouter } from "next/router";
import axios from "axios";
import NormalToast from "../../util/Toast/NormalToast";

function DishInfo({
  _id,
  title,
  price,
  description,
  category,
  image,
  border,
  removeFromSearchResults,
}) {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  console.log("DishInfo - Image URL:", image); // Debug log
  console.log("DishInfo - Full dish data:", { _id, title, image }); // Debug log

  // Process image URL to use the correct API endpoint for uploaded images
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If the image path starts with /uploads/, convert it to use the serve-image API
    if (imagePath.startsWith('/uploads/')) {
      const filename = imagePath.split('/').pop();
      return `/api/serve-image?filename=${filename}`;
    }
    
    // If it's already an API URL or a static image, return as is
    return imagePath;
  };

  const processedImageUrl = getImageUrl(image);

  // Simple image loading test
  useEffect(() => {
    if (image) {
      console.log("Image URL:", image);
      console.log("Processed Image URL:", processedImageUrl);
      setImageLoading(false);
    } else {
      setImageLoading(false);
    }
  }, [image, processedImageUrl]);

  const deleteDish = async (_id) => {
    setDisabled(true);
    
    try {
      // Get session ID from localStorage
      const sessionId = localStorage.getItem("adminSessionId");
      
      if (!sessionId) {
        NormalToast("Session expired. Please login again.", true);
        return;
      }

      const response = await axios.post("/api/admin/delete-dish", { _id }, {
        headers: {
          'x-session-id': sessionId
        }
      });
      
      if (response.status === 200) {
        NormalToast("Dish deleted successfully");
        removeFromSearchResults(_id);
      } else {
        NormalToast("Failed to delete dish", true);
      }
    } catch (err) {
      console.error("Error deleting dish:", err);
      
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

  const handleImageError = (e) => {
    console.error("Image failed to load:", processedImageUrl);
    console.error("Image element:", e.target);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully:", processedImageUrl);
    setImageError(false);
    setImageLoading(false);
  };

  return (
    <div
      className={`flex sm:flex-row flex-col-reverse w-full my-1 text-sm text-gray-700 py-2 ${border ? "border-b border-gray-200" : ""
        } sm:justify-between gap-3`}
    >
      <div className="space-y-1">
        <div className="font-semibold text-base capitalize">{title}</div>
        <div className="text-primary-light capitalize">{category}</div>
        <p className="text-gray-500 lg:text-sm text-xs">{description}</p>
        <div>
          <p className="font-semibold">
            <span className="font-normal">Price - </span>
            {formatCurrency(price)}
          </p>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button
            className={`button py-1 xxs:px-6 px-4 ${disabled ? "opacity-50" : ""
              }`}
            onClick={() => router.push(`/admin/update-dish/${_id}`)}
            disabled={disabled}
          >
            Update
          </button>
          <button
            className={`button-red py-1 xxs:px-6 px-4 ${disabled ? "opacity-50" : ""
              }`}
            onClick={() => deleteDish(_id)}
            disabled={disabled}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="sm:mx-0 sm:ml-3 min-w-max mx-auto my-auto">
        {processedImageUrl ? (
          <img
            src={processedImageUrl}
            alt={title}
            className="w-20 h-20 object-cover rounded"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageError ? 'none' : 'block' }}
          />
        ) : null}
        {imageError && (
          <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
            Failed to load
          </div>
        )}
        {!processedImageUrl && (
          <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
            No Image
          </div>
        )}
      </div>
    </div>
  );
}

export default DishInfo;
