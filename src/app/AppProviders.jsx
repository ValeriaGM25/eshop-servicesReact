import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../features/auth/context/AuthProvider.jsx'
import { BasketProvider } from '../features/basket/context/BasketProvider.jsx'
import { NotificationProvider } from '../features/notifications/NotificationProvider.jsx'

export default function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <BasketProvider>{children}</BasketProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  )
}
