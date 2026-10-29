import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ProductDetails from "./ProductDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import  CartProvider from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

function App()
{
    return (
        <AuthProvider>
        <CartProvider>

            <BrowserRouter>

                <Navbar />

                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/products"
                        element={<ProductsPage />}
                    />

                    <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                    />

                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <CheckoutPage/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={<LoginPage/>}
                    />
                    <Route
                        path="/register"
                        element={<RegisterPage/>}
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <OrdersPage/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders/:id"
                        element={
                            <ProtectedRoute>
                                <OrderDetailsPage/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <AdminRoute>
                                <AdminDashboard/>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/orders"
                        element={
                            <AdminRoute>
                                <AdminOrdersPage/>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/products"
                        element={
                            <AdminRoute>
                                <AdminProductsPage/>
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/categories"
                        element={
                            <AdminRoute>
                                <AdminCategoriesPage/>
                            </AdminRoute>
                        }
                    />
                </Routes>

            </BrowserRouter>

        </CartProvider>
        </AuthProvider>
    );
}

export default App;