import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './contexts/OrderContext';
import HomePage from './pages/HomePage';
import ServiceForm from './pages/ServiceForm';
import PaymentPage from './pages/PaymentPage';

export default function App() {
  return (
    <OrderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/service-form" element={<ServiceForm />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </BrowserRouter>
    </OrderProvider>
  );
}
