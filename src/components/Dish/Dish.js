import { formatCurrency } from "../../util/currencyFormatter";
import { useDispatch } from "react-redux";
import { addToCart } from "../../slices/cartSlice";
import Fade from "react-reveal/Fade";
import { ShoppingCartIcon } from "@heroicons/react/solid";

function Dish({ _id, title, price, description, category, image }) {
  const dispatch = useDispatch();
  
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
  
  const addItemToCart = () => {
    //Sending the Dish as an action to the REDUX store... the cart slice
    dispatch(
      addToCart({
        _id,
        title,
        price,
        description,
        category,
        image,
        qty: 1,
        toast: true,
      })
    );
  };

  return (
    <Fade bottom>
      <div className="relative flex flex-col   bg-white z-20  md:p-8 p-6 rounded-md shadow-lg">
        <p className="absolute top-2 right-3 text-xs italic text-gray-400 capitalize">
          {category}
        </p>
        <div className="relative">
          <img
            src={processedImageUrl}
            alt={title}
            className="w-full h-48 object-cover rounded"
            onError={(e) => {
              console.error("Image failed to load:", processedImageUrl);
              console.error("Original image path:", image);
              console.error("Error details:", e);
              e.target.style.display = 'none';
            }}
            onLoad={() => {
              console.log("Image loaded successfully:", processedImageUrl);
            }}
          />
          {!processedImageUrl && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        <h4 className="my-3 font-medium capitalize">
          {title}
        </h4>
        <p className="text-xs  mb-2 line-clamp-2 text-gray-500">
          {description}
        </p>
        <div className="mb-5 mt-2 font-bold text-gray-700">
          {formatCurrency(price)}
        </div>
        <button
          className="mt-auto button flex items-center justify-center"
          onClick={addItemToCart}
        >
          <ShoppingCartIcon className="w-4" />
          <span className="ml-2">Add to Cart</span>
        </button>
      </div>
    </Fade>
  );
}

export default Dish;
