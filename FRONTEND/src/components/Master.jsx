import { BrowserRouter, Routes, Route } from "react-router-dom";

// Global
import Login from "./global/Login";
import LandingPage from "./global/LandingPage";
import Error from "./global/Error";

// Admin
import AdminDashboard from "./admin/AdminDashboard";
import Register from "./admin/Register";

// Restaurant Owner
import ResOwner from "./resowner/ResOwner";

// Customer
import CusDashboard from "./customer/CusDashboard";
import CustomerHome from "./customer/CustomerHome";
import RestaurantList from "./customer/RestaurantList";
import RestaurantDetail from "./customer/RestaurantDetail";
import Cart from "./customer/Cart";
import Checkout from "./customer/Checkout";
import OrderList from "./customer/OrderList";
import OrderDetail from "./customer/OrderDetail";
import ReviewList from "./customer/ReviewList";
import CustomerProfile from "./customer/CustomerProfile";

// Delivery - Integrated directly
import DeliveryLogin from "../delivery/pages/Login";
import DeliveryRegister from "../delivery/pages/Register";
import DeliveryDashboard from "../delivery/components/DeliveryDashboard";
import AcceptedOrderPage from "../delivery/components/AcceptedOrderPage";
import DeliveryHistory from "../delivery/pages/DeliveryHistory";
import ProfilePage from "../delivery/pages/ProfilePage";
import ProfilePanel from "../delivery/components/ProfilePanel";
import FeedbackPage from "../delivery/pages/FeedbackPage";
import AboutPage from "../delivery/pages/AboutPage";
import HelpSupportPage from "../delivery/pages/HelpSupportPage";

const Master = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Global Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<Error />} />

        {/* Admin Routes */}
        <Route path="/admindashboard" element={<AdminDashboard />}>
          <Route index element={<Register />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Restaurant Owner */}
        <Route path="/resowner" element={<ResOwner />} />

        {/* Customer Routes */}
        <Route path="/CusDashboard" element={<CusDashboard />}>
          <Route index element={<CustomerHome />} />
          <Route path="restaurants" element={<RestaurantList />} />
          <Route path="restaurants/:id" element={<RestaurantDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="reviews" element={<ReviewList />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>

        {/* Delivery Routes - Direct (No Layout) */}
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route path="/register" element={<DeliveryRegister />} />
        <Route path="/dashboard" element={<DeliveryDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/delivery/orders/:id/accepted" element={<AcceptedOrderPage />} />
        <Route path="/delivery/history" element={<DeliveryHistory />} />
        <Route path="/delivery/profile-panel" element={<ProfilePanel />} />
        <Route path="/delivery/feedback" element={<FeedbackPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<HelpSupportPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Master;
