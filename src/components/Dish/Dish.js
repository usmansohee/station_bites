import { formatCurrency } from "../../util/currencyFormatter";
import { useDispatch } from "react-redux";
import { addToCart } from "../../slices/cartSlice";
import Fade from "react-reveal/Fade";
import { ShoppingCartIcon } from "@heroicons/react/solid";

function Dish({ _id, title, regularPrice, largePrice, kingPrice, description, category, image }) {
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
  
  // Placeholder image for when the main image fails to load
  const placeholderImage = '/img/empty.svg';
  
  const addItemToCart = () => {
    // Use the first available price for cart
    const cartPrice = regularPrice || largePrice || kingPrice;
    
    //Sending the Dish as an action to the REDUX store... the cart slice
    dispatch(
      addToCart({
        _id,
        title,
        price: cartPrice,
        regularPrice,
        largePrice,
        kingPrice,
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
            src={processedImageUrl || placeholderImage}
            alt={title}
            className="w-full h-48 object-cover rounded"
            onError={(e) => {
              console.warn("Image failed to load:", processedImageUrl);
              console.warn("Original image path:", image);
              console.warn("Falling back to placeholder image");
              // Fallback to placeholder image
              if (e.target.src !== placeholderImage) {
                e.target.src = placeholderImage;
              }
            }}
            // onLoad={(e) => {
            //   console.log("Image loaded successfully:", e.target.src);
            // }}
          />
        </div>
        <h4 className="my-3 font-medium capitalize">
          {title}
        </h4>
        <p className="text-xs  mb-2 line-clamp-2 text-gray-500">
          {description}
        </p>
        <div className="mb-5 mt-2 font-bold text-gray-700">
          {regularPrice && <div>Regular: {formatCurrency(regularPrice)}</div>}
          {largePrice && <div>Large: {formatCurrency(largePrice)}</div>}
          {kingPrice && <div>King: {formatCurrency(kingPrice)}</div>}
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
