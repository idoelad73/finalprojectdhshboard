import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
  X,
  Package,
  DollarSign,
  Tag,
  Star,
  Box,
  FileText,
  ImagePlus,
  Sparkles
} from 'lucide-react';

export default function EditProduct() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    description: '',
    category: '',
    price: 0,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    brand: '',
    tags: '',
    images: '',
    productImageFile: null
  });

  /* ---------------- LOAD PRODUCT ---------------- */
  useEffect(() => {
    const productFromState = location.state?.product;

    if (productFromState) {
      normalizeProduct(productFromState);
      setLoading(false);
    } else {
      fetchProductById(id);
    }
  }, [id, location.state]);

  const normalizeProduct = (product) => {
    setFormData({
      _id: product._id,
      title: product.title || '',
      description: product.description || '',
      category: product.category || '',
      price: product.price || 0,
      discountPercentage: product.discountPercentage || 0,
      rating: product.rating || 0,
      stock: product.stock || 0,
      brand: product.brand || '',
      tags: product.tags?.join(', ') || '',
      images: Array.isArray(product.images) ? product.images[0] : product.images || '',
      productImageFile: null
    });
  };

  const fetchProductById = async (productId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/products/${productId}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      normalizeProduct(data);
    } catch (err) {
      alert('Failed to load product');
      navigate('/dashboard/products');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- INPUT HANDLER ---------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'productImageFile') {
      setFormData((prev) => ({ ...prev, productImageFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'productImageFile' && key !== 'images' && key !== '_id') {
        data.append(key, value);
      }
    });
  
    if (formData.productImageFile) {
      data.append('product_image', formData.productImageFile);
    }
  
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/products/${formData._id}`,
      { method: 'PUT', body: data }
    );
  
    if (!res.ok) {
      const err = await res.json();
      return Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.message || 'Something went wrong',
        confirmButtonColor: '#ef4444'
      });
    }
  
    Swal.fire({
      icon: 'success',
      title: 'Product Updated!',
      text: 'The product was updated successfully.',
      confirmButtonColor: '#7c3aed',
      timer: 1800,
      showConfirmButton: false
    }).then(() => {
      navigate('/dashboard', { replace: true });
    });
  };
  

  if (!isModalOpen || loading) return null;

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <Sparkles />
            <h2 className="text-lg font-semibold">Edit Product</h2>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-white hover:opacity-80">
            <X />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">

          {/* Title */}
          <LabeledInput label="Title" icon={Package} placeholder="Product title" name="title" value={formData.title} onChange={handleChange} />

          {/* Description */}
          <LabeledTextarea label="Description" icon={FileText} placeholder="Description" name="description" value={formData.description} onChange={handleChange} />

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4">
            <LabeledInput label="Brand" icon={Sparkles} placeholder="Brand" name="brand" value={formData.brand} onChange={handleChange} />
            <LabeledInput label="Category" icon={Tag} placeholder="Category" name="category" value={formData.category} onChange={handleChange} />
            <LabeledInput label="Price" icon={DollarSign} type="number" placeholder="Price" name="price" value={formData.price} onChange={handleChange} />
            <LabeledInput label="Discount %" icon={Tag} type="number" placeholder="Discount %" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} />
            <LabeledInput label="Rating" icon={Star} type="number" placeholder="Rating" name="rating" value={formData.rating} onChange={handleChange} />
            <LabeledInput label="Stock" icon={Box} type="number" placeholder="Stock" name="stock" value={formData.stock} onChange={handleChange} />
          </div>

          {/* Tags */}
          <LabeledInput label="Tags" icon={Tag} placeholder="Tags (comma separated)" name="tags" value={formData.tags} onChange={handleChange} />

          {/* Image */}
          <div className="grid grid-cols-2 gap-6 items-center">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Upload Image</span>
              <input
                type="file"
                name="productImageFile"
                accept="image/*"
                onChange={handleChange}
                className="file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0
                           file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
              />
            </label>

            <img
              src={formData.productImageFile ? URL.createObjectURL(formData.productImageFile) : formData.images}
              alt="Preview"
              className="h-32 w-full object-contain rounded-lg border"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
            />
          </div>
        </form>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL UI COMPONENTS ---------------- */
const LabeledInput = ({ label, icon: Icon, ...props }) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
    <input
      {...props}
      className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
    />
  </div>
);

const LabeledTextarea = ({ label, icon: Icon, ...props }) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
    <Icon className="absolute left-3 top-3 text-slate-400" size={18} />
    <textarea
      {...props}
      rows={3}
      className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
    />
  </div>
);
