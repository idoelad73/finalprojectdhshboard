import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';

import {
  X,
  Package,
  DollarSign,
  Tag,
  Star,
  Box,
  FileText,
  Sparkles
} from 'lucide-react';

import productOptions from '../../../data/productOptions.json';
import { createProductValidation } from './product.validation';

export default function AddProduct() {
  const navigate = useNavigate();
  const { categories, brands } = productOptions;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    brand: '',
    tags: '',
    images: null
  });

  /* ---------------- INPUT HANDLER ---------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'images') {
      setFormData((prev) => ({ ...prev, images: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ---------------- API CALL ---------------- */
  const addProductMutation = useMutation({
    mutationFn: async (newProduct) => {
      // Zod validation
      const parsed = createProductValidation.safeParse({
        ...newProduct,
        price: Number(newProduct.price),
        discountPercentage: Number(newProduct.discountPercentage),
        rating: Number(newProduct.rating),
        stock: Number(newProduct.stock)
      });
  
      if (!parsed.success) {
        throw new Error(parsed.error.errors[0].message);
      }
  
      const data = new FormData();
  
      Object.entries(newProduct).forEach(([key, value]) => {
        if (key !== 'images') {
          data.append(key, value);
        }
      });
  
      // multer field name
      if (newProduct.images) {
        data.append('product_image', newProduct.images);
      }
  
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/products/add-product`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      return res.data;
    },
  
    onMutate: () => {
      // Show loading SweetAlert2
      Swal.fire({
        title: 'Adding Product...',
        html: '<img src="https://i.gifer.com/YCZH.gif" alt="Loading..." width="80" />', // nice loading gif
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    },
  
    onSuccess: () => {
      Swal.close(); // close loading modal
  
      Swal.fire({
        icon: 'success',
        title: 'Product Added!',
        text: 'The product was created successfully.',
        confirmButtonColor: '#7c3aed',
        timer: 1800,
        showConfirmButton: false
      }).then(() => {
        navigate('/dashboard', { replace: true });
      });
    },
  
    onError: (error) => {
      Swal.close(); // close loading modal
  
      Swal.fire({
        icon: 'error',
        title: 'Creation Failed',
        text: error.message || 'Something went wrong',
        confirmButtonColor: '#ef4444'
      });
    }
  });
  

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    addProductMutation.mutate(formData);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <Sparkles />
            <h2 className="text-lg font-semibold">Add Product</h2>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-white hover:opacity-80">
            <X />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">

          <Input icon={Package} placeholder="Product title" name="title" value={formData.title} onChange={handleChange} />
          <Textarea icon={FileText} placeholder="Description" name="description" value={formData.description} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-4">

            {/* BRAND */}
            <Select icon={Sparkles} name="brand" value={formData.brand} onChange={handleChange}>
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Select>

            {/* CATEGORY */}
            <Select icon={Tag} name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>

            <Input icon={DollarSign} type="number" placeholder="Price" name="price" value={formData.price} onChange={handleChange} />
            <Input icon={Tag} type="number" placeholder="Discount %" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} />
            <Input icon={Star} type="number" placeholder="Rating" name="rating" value={formData.rating} onChange={handleChange} />
            <Input icon={Box} type="number" placeholder="Stock" name="stock" value={formData.stock} onChange={handleChange} />

          </div>

          <Input icon={Tag} placeholder="Tags (comma separated)" name="tags" value={formData.tags} onChange={handleChange} />

          {/* IMAGE */}
          <div className="grid grid-cols-2 gap-6 items-center">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Upload Image</span>
              <input
                type="file"
                name="images"
                accept="image/*"
                onChange={handleChange}
                className="file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0
                           file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
              />
            </label>

            <img
              src={formData.images ? URL.createObjectURL(formData.images) : 'https://via.placeholder.com/150'}
              alt="Preview"
              className="h-32 w-full object-contain rounded-lg border"
            />
          </div>
        </form>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={addProductMutation.isLoading}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
          >
            {addProductMutation.isLoading ? 'Saving...' : 'Add Product'}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ---------------- SMALL UI COMPONENTS ---------------- */

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
    <input {...props} className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none" />
  </div>
);

const Textarea = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-3 text-slate-400" size={18} />
    <textarea {...props} rows={3} className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
  </div>
);

const Select = ({ icon: Icon, children, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
    <select {...props} className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none">
      {children}
    </select>
  </div>
);
