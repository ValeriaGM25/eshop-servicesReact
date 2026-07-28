import { Route, Routes } from 'react-router-dom'
import BasketPage from '../features/basket/pages/BasketPage.jsx'
import CatalogPage from '../features/catalog/pages/CatalogPage.jsx'
import ProductDetailsPage from '../features/catalog/pages/ProductDetailsPage.jsx'
import LoginPage from '../features/auth/pages/LoginPage.jsx'
import RegisterPage from '../features/auth/pages/RegisterPage.jsx'
import AccountPage from '../features/auth/pages/AccountPage.jsx'
import UnauthorizedPage from '../features/auth/pages/UnauthorizedPage.jsx'
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage.jsx'
import AdminProductsPage from '../features/admin/pages/AdminProductsPage.jsx'
import CreateProductPage from '../features/admin/pages/CreateProductPage.jsx'
import EditProductPage from '../features/admin/pages/EditProductPage.jsx'
import Layout from '../shared/components/Layout.jsx'
import AdminLayout from '../features/admin/components/AdminLayout.jsx'
import ProtectedRoute from '../features/auth/components/ProtectedRoute.jsx'
import RoleRoute from '../features/auth/components/RoleRoute.jsx'
import NotFoundPage from '../shared/components/NotFoundPage.jsx'
import HomePage from './HomePage.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<CatalogPage />} />
        <Route path="/productos/:id" element={<ProductDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/no-autorizado" element={<UnauthorizedPage />} />
        <Route path="/mi-cuenta" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/carrito" element={<RoleRoute roles={['Cliente']}><BasketPage /></RoleRoute>} />
        <Route path="/admin" element={<RoleRoute roles={['Admin']}><AdminLayout /></RoleRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="productos" element={<AdminProductsPage />} />
          <Route path="productos/nuevo" element={<CreateProductPage />} />
          <Route path="productos/:id/editar" element={<EditProductPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
