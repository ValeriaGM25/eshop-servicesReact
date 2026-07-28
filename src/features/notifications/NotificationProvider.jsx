import { useCallback, useMemo, useState } from 'react'
import { NotificationContext } from './NotificationContext.jsx'

let toastId = 0

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const value = useMemo(() => ({ showNotification: addToast }), [addToast])

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast show align-items-center text-bg-${toast.type} border-0 mb-2`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body">
                {toast.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              />
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}
