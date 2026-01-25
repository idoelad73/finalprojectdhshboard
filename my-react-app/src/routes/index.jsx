import { lazy } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "./Layout";

const AboutPage= lazy(() => import("../components/pages/about/About"));
const LoginPage= lazy(() => import("../components/pages/login/LogIn"));
const Dashboard= lazy(() => import("../components/pages/dashboard/Dashboard"));
const EditProduct= lazy(() => import("../components/pages/products/EditProduct"));
const AddProduct= lazy(() => import("../components/pages/products/AddProduct"));




export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
         <Route index element={<AboutPage />} />
        <Route path="/about" index element={<AboutPage />} />
        <Route path="/login" index element={<LoginPage />} />
        <Route path="/dashboard" index element={<Dashboard />} />
        <Route path="/products/edit-product/:id"  element={<EditProduct />} />
        <Route path="/products/add-product/"  element={<AddProduct />} />
        </Route>
  )
);