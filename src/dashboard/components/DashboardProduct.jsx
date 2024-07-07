import React, { useEffect, useState, useCallback } from "react";
import AxiosInstance from "../../config/AxiosInstance";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const DashboardProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { search } = useSelector((state) => state.search);
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await AxiosInstance.get("/dashboard/get-all-products");
      if (data?.data) {
        setProducts(data.data);
        setFilteredProduct(data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    const deleteProduct = confirm(
      "Are you sure you want to delete this product?"
    );
    if (deleteProduct) {
      try {
        const { data } = await AxiosInstance.delete(
          `/dashboard/product/delete-product/${id}`
        );
        if (data.statusCode === 200) {
          toast.success(data.message);
          setRefresh(!refresh); // Trigger refetch
        } else {
          toast.error("Failed to delete product");
        }
      } catch (error) {
        console.error("Failed to delete product", error);
        toast.error("Failed to delete product");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  const filteredProductItem = filteredProducts.filter((product) =>
    product.title.toLowerCase().includes(search?.toLowerCase())
  );
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredProduct(products);
    } else {
      setFilteredProduct(filteredProductItem);
    }
  }, [search]);
  if (isLoading) {
    return (
      <div className="flex items-center text-2xl font-bold justify-center animate-pulse">
        Loading products
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <h1 className="text-2xl flex items-center justify-between font-semibold mb-4">
        My items
        <button className="text-white rounded-lg bg-red-500 text-base px-4 py-2 tracking-wider">
          Delete Products
        </button>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Link
          to="/dashboard/products/create"
          className="border-2 cursor-pointer border-dashed border-gray-300 flex items-center justify-center p-4 flex-col rounded-lg"
        >
          <span className="text-gray-400">Create a new product.</span>
          <span className="text-5xl">+</span>
        </Link>
        {filteredProducts && filteredProducts.length !== 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="relative border rounded-lg p-4 bg-white shadow"
            >
              <input type="checkbox" className="absolute top-2 left-2" />
              <div className="flex flex-col items-center">
                {product.images[0]?.url && (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <h2 className="text-lg font-semibold truncate">
                  {product.title}
                </h2>
                <p className="text-blue-500 truncate">Rs:{product.price}</p>
                <p className="text-sm text-gray-500">
                  Quantity :{product.quantity}
                </p>
                <p className="text-sm flex items-center justify-between w-full text-gray-500">
                  <Link
                    className="bg-blue-500 hover:bg-blue-700 py-2 px-5 text-white tracking-wide"
                    to={`/dashboard/products/edit/${product._id}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 py-2 px-5 hover:bg-red-800 text-white tracking-wide"
                  >
                    Delete
                  </button>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center text-2xl ">
            No product found
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardProduct;
