"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormData, ProductCategory } from "@/types";
import { createProduct, updateProduct } from "@/lib/api";
import { useAuthStore } from "@/store";

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  productId?: string;
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  productId,
  isEdit = false,
}) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || ProductCategory.OTHER,
    images: initialData?.images || [],
    stock: initialData?.stock || 0,
    weight: initialData?.weight || undefined,
    ingredients: initialData?.ingredients || "",
    allergens: initialData?.allergens || "",
    brand: initialData?.brand || "",
    expiryDate: initialData?.expiryDate || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const isValidImageUrl = (url: string): boolean => {
    // Check if URL is valid
    try {
      new URL(url);
    } catch {
      return false;
    }

    // Check if URL ends with common image extensions
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".svg",
    ];
    const lowercaseUrl = url.toLowerCase();

    // Check for direct image URLs
    if (imageExtensions.some((ext) => lowercaseUrl.includes(ext))) {
      return true;
    }

    // Check for common image hosting patterns
    const imageHostPatterns = [
      "imgur.com",
      "unsplash.com",
      "pexels.com",
      "pixabay.com",
      "cloudinary.com",
      "amazonaws.com",
      "googleusercontent.com",
    ];

    return imageHostPatterns.some((pattern) => lowercaseUrl.includes(pattern));
  };

  const handleAddImageUrl = () => {
    const trimmedUrl = newImageUrl.trim();

    if (!trimmedUrl) {
      setImageUrlError("Please enter an image URL");
      return;
    }

    if (!isValidImageUrl(trimmedUrl)) {
      setImageUrlError(
        "Please enter a valid image URL (must end with .jpg, .png, .gif, .webp, etc. or be from a known image hosting service)"
      );
      return;
    }

    // Clear any previous error
    setImageUrlError("");

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, trimmedUrl],
    }));
    setNewImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to create products");
      return;
    }

    // Validations
    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (formData.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (formData.stock < 0) {
      setError("Stock cannot be negative");
      return;
    }

    if (!isEdit && formData.images.length === 0) {
      setError("You must add at least one image URL");
      return;
    }

    // Validate all image URLs
    const invalidImages = formData.images.filter(
      (url) => !isValidImageUrl(url)
    );
    if (invalidImages.length > 0) {
      setError(
        `Some image URLs are invalid: ${invalidImages.slice(0, 2).join(", ")}${
          invalidImages.length > 2 ? "..." : ""
        }`
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isEdit && productId) {
        await updateProduct(productId, formData);
        router.push(`/admin/products`);
      } else {
        const newProduct = await createProduct(formData, user.id);
        router.push(`/admin/products`);
      }
    } catch (err: any) {
      setError(err.message || "Error saving product");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? "Edit Product" : "Create New Product"}
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g. Artisan Potato Chips"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Describe your product..."
          />
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Stock *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        {/* Category and Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value={ProductCategory.CHIPS}>Chips & Snacks</option>
              <option value={ProductCategory.COOKIES}>Cookies</option>
              <option value={ProductCategory.CANDY}>Candy</option>
              <option value={ProductCategory.NUTS}>Nuts</option>
              <option value={ProductCategory.CHOCOLATE}>Chocolate</option>
              <option value={ProductCategory.CRACKERS}>Crackers</option>
              <option value={ProductCategory.POPCORN}>Popcorn</option>
              <option value={ProductCategory.DRIED_FRUITS}>Dried Fruits</option>
              <option value={ProductCategory.HEALTHY}>Healthy</option>
              <option value={ProductCategory.BEVERAGES}>Beverages</option>
              <option value={ProductCategory.OTHER}>Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Weight (grams)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight || ""}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="100"
            />
          </div>
        </div>

        {/* Brand and Expiry Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g. Premium Brand"
            />
          </div>

          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label
            htmlFor="ingredients"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ingredients
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Potatoes, vegetable oil, salt..."
          />
        </div>

        {/* Allergens */}
        <div>
          <label
            htmlFor="allergens"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Allergens
          </label>
          <input
            type="text"
            id="allergens"
            name="allergens"
            value={formData.allergens}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g. Gluten, nuts"
          />
        </div>

        {/* Image URLs */}
        <div>
          <label
            htmlFor="newImageUrl"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Product Images {!isEdit && "*"}
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Only direct image URLs are accepted (.jpg, .png, .gif, .webp, etc.)
            or links from image hosting services like Unsplash, Imgur, etc.
          </p>
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              id="newImageUrl"
              name="newImageUrl"
              value={newImageUrl}
              onChange={(e) => {
                setNewImageUrl(e.target.value);
                setImageUrlError(""); // Clear error when user types
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Paste direct image URL here (e.g. https://example.com/image.jpg)"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Add Image
            </button>
          </div>

          {imageUrlError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{imageUrlError}</p>
            </div>
          )}

          {formData.images.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Added Images:
              </h4>
              <div className="space-y-2">
                {formData.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAyMEgyNE0yMCAxNlYyNE0xMiAyMEM4LjY4NjI5IDIwIDYgMTcuMzEzNyA2IDE0QzYgMTAuNjg2MyA4LjY4NjI5IDggMTIgOEMyOCA4IDI4IDggMjggOEMzMS4zMTM3IDggMzQgMTAuNjg2MyAzNCAxNEMzNCAx 3LjMxMzcgMzEuMzEzNyAyMCAyOCAyMEgyNE0yMCAyOEMxNy4yMzg2IDI4IDE1IDI1Ljc2MTQgMTUgMjNWMjBIMjVWMjNDMjUgMjUuNzYxNCAyMi43NjE0IDI4IDIwIDI4WiIgc3Ryb2tlPSIjOTlBMUFBIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs text-gray-600 truncate"
                        title={imageUrl}
                      >
                        {imageUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-700 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 text-sm text-gray-500">
            <p>
              💡 <strong>Tip:</strong> You can find images on:
            </p>
            <ul className="list-disc ml-4 mt-1">
              <li>Google Images (right-click → "Copy image address")</li>
              <li>Unsplash.com (free stock photos)</li>
              <li>Product manufacturer websites</li>
              <li>Amazon product pages</li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading
              ? "Saving..."
              : isEdit
              ? "Update Product"
              : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
