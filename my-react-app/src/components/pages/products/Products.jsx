import { Plus, Pencil, Trash2 } from 'lucide-react';
import TableWrapper from '../../pages/dashboard/Tablewrapper';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import productOptions from '../../../data/productOptions.json';

const { categories } = productOptions;

export default function Products() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* -------------------- Filters State -------------------- */
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // pagination

  const PRODUCTS_PER_PAGE = 10;

  /* -------------------- Fetch Functions -------------------- */
  const fetchProducts = async ({ queryKey }) => {
    const [_key, { q, category }] = queryKey;
    const params = {};
    if (q) params.q = q;
    if (category) params.category = category;

    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/products/autocomplete/products`,
      { params }
    );

    return response.data.products || [];
  };

  const fetchProductsByCategory = async (category) => {
    if (!category) return []; 
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/products/product-category/${category}`
    );
    return response.data.products || [];
  };

  const fetchAllProducts = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/products/all`
    );
    return response.data.products || [];
  };

  /* -------------------- React Query -------------------- */
  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory],
    queryFn: async () => {
      if (searchQuery)
        return fetchProducts({ queryKey: ['products', { q: searchQuery, category: selectedCategory }] });
      if (selectedCategory) return fetchProductsByCategory(selectedCategory);
      return fetchAllProducts();
    },
    keepPreviousData: true,
  });

  /* -------------------- Pagination Logic -------------------- */
  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = allProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* -------------------- Actions -------------------- */
  const handleAddProduct = () => {
    navigate('/products/add-product/');
  };

  const handleEditProduct = (product) => {
    navigate(`/products/edit-product/${product.id}`, { state: { product } });
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/products/delete/${productId}`
      );

      Swal.fire({
        title: 'Deleted!',
        text: 'Product has been deleted successfully.',
        icon: 'success',
        confirmButtonColor: '#6366f1',
      });

      queryClient.invalidateQueries(['products']);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete product.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
    }
  };

 
  return (
    <div className="space-y-4">
      {/* -------------------- Header / Filters -------------------- */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Products</h2>
          <button
            onClick={handleAddProduct}
            className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl
                     bg-gradient-to-r from-indigo-500 to-purple-600
                     text-white font-semibold shadow-lg text-sm sm:text-base
                     hover:shadow-xl hover:-translate-y-0.5 transition"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* -------------------- Table -------------------- */}
      <TableWrapper loading={isLoading} error={error?.message}>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-4 px-6 text-sm font-bold text-slate-700 uppercase">Title</th>
              <th className="text-left py-4 px-6 text-sm font-bold text-slate-700 uppercase">Image</th>
              <th className="text-left py-4 px-6 text-sm font-bold text-slate-700 uppercase">Category</th>
              <th className="text-left py-4 px-6 text-sm font-bold text-slate-700 uppercase">Price</th>
              <th className="text-left py-4 px-6 text-sm font-bold text-slate-700 uppercase">Stock</th>
              <th className="text-center py-4 px-6 text-sm font-bold text-slate-700 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {paginatedProducts.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">{p.title}</td>

                <td className="py-4 px-6">
                  <img
                    src={Array.isArray(p.images) ? p.images[0] : p.images}
                    alt={p.title}
                    className="w-16 h-16 rounded-xl object-cover shadow-sm ring-1 ring-slate-200"
                  />
                </td>

                <td className="py-4 px-6">
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
                    {p.category}
                  </span>
                </td>

                <td className="py-4 px-6 font-bold text-lg text-slate-900">${p.price}</td>

                <td className="py-4 px-6">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      p.stock > 50
                        ? 'bg-green-100 text-green-700'
                        : p.stock > 20
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>

                <td className="py-4 px-6">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEditProduct(p)}
                      className="inline-flex items-center p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                      title="Edit Product"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* -------------------- Pagination -------------------- */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded border hover:bg-indigo-100 ${
                  currentPage === i + 1 ? 'bg-indigo-500 text-white' : 'bg-white text-slate-700'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </TableWrapper>
    </div>
  );
}
