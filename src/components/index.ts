// Layout components
export { default as Navbar } from "./layout/Navbar";
export { default as Footer } from "./layout/Footer";
export { default as ClientWrapper } from "./layout/ClientWrapper";

// UI components
export { default as ProductCard } from "./ui/ProductCard";
export { default as SearchBar } from "./ui/SearchBar";
export { default as Toast, ToastContainer, showToast } from "./ui/Toast";

// Form components
export { default as ProductForm } from "./forms/ProductForm";

// Admin components
export { default as AdminGuard } from "./admin/AdminGuard";
export { default as ProductsTable } from "./admin/ProductsTable";

// Store components
export * from "../store";
