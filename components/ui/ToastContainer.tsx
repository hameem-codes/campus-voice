'use client'

import React from 'react'
import { useStore } from '@/lib/store'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

export function ToastContainer() {
  const { toasts, removeToast } = useStore()

  if (toasts.length === 0) return null

  return (
    <div
      className="toast-container"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
            ? AlertCircle
            : toast.type === 'warning'
            ? AlertTriangle
            : Info

        return (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.type}`}
            role="status"
          >
            <div className="toast-icon">
              <Icon width={16} height={16} />
            </div>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              {toast.message && <div className="toast-message">{toast.message}</div>}
            </div>
            {toast.actionLabel && toast.onAction && (
              <button
                type="button"
                className="toast-action"
                onClick={() => {
                  toast.onAction?.()
                  removeToast(toast.id)
                }}
              >
                {toast.actionLabel}
              </button>
            )}
            <button
              type="button"
              className="toast-close"
              aria-label="Close alert"
              onClick={() => removeToast(toast.id)}
            >
              <X width={14} height={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
