'use client'

import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useNotification, Toast as ToastType } from '@/context/NotificationContext'
import { Button } from '@/components/ui/Button'

export function NotificationProviderUI() {
  const { toasts, removeToast, confirmState, setConfirmState } = useNotification()

  const handleConfirm = (value: boolean) => {
    if (confirmState) {
      confirmState.resolve(value)
      setConfirmState(null)
    }
  }

  return (
    <>
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none w-full max-w-sm font-sans">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {/* Confirmation Modal */}
      <Transition appear show={!!confirmState} as={Fragment}>
        <Dialog as="div" className="relative z-[10000]" onClose={() => handleConfirm(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-none border-2 border-gray-900 bg-white p-10 text-left align-middle shadow-2xl transition-all">
                  <div className="flex items-start gap-6 mb-8">
                    <div className={`p-4 rounded-none shrink-0 ${confirmState?.variant === 'destructive' ? 'bg-[#fef2f2] text-[#991b1b]' : 'bg-gray-50 text-gray-900'}`}>
                      {confirmState?.variant === 'destructive' ? <AlertTriangle className="w-8 h-8" /> : <Info className="w-8 h-8" />}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">CONFIRMATION</div>
                      <Dialog.Title as="h3" className="text-[20px] font-bold leading-tight text-gray-900 mb-3 tracking-tight">
                        {confirmState?.title}
                      </Dialog.Title>
                      <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                        {confirmState?.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-8">
                    <Button
                      variant="secondary"
                      onClick={() => handleConfirm(false)}
                      className="px-8 h-12 text-[11px] font-sans font-bold uppercase tracking-widest border-2 border-gray-200"
                    >
                      {confirmState?.cancelText || 'Cancel'}
                    </Button>
                    <Button
                      variant={confirmState?.variant === 'destructive' ? 'destructive' : 'primary'}
                      onClick={() => handleConfirm(true)}
                      className={`px-10 h-12 text-[11px] font-sans font-bold uppercase tracking-widest ${confirmState?.variant === 'destructive' ? 'bg-[#991b1b]' : 'bg-gray-900'} text-white shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:translate-y-[-2px] active:translate-y-[0px] transition-all`}
                    >
                      {confirmState?.confirmText || 'Confirm'}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

function ToastItem({ toast, onRemove }: { toast: ToastType; onRemove: (id: string) => void }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-[#991b1b]" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    info: <Info className="w-5 h-5 text-gray-900" />,
  }

  const borderStyles = {
    success: 'border-l-[4px] border-l-green-600',
    error: 'border-l-[4px] border-l-[#991b1b]',
    warning: 'border-l-[4px] border-l-amber-600',
    info: 'border-l-[4px] border-l-gray-900',
  }

  return (
    <div className={`pointer-events-auto flex items-center gap-4 w-full px-6 py-5 rounded-none border border-gray-200 bg-white shadow-xl ${borderStyles[toast.type]} transition-all animate-in slide-in-from-right duration-300`}>
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{toast.type}</div>
        <p className="text-[11px] font-bold text-gray-900 leading-tight tracking-[0.05em] uppercase font-sans">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 p-1 hover:bg-gray-100 transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  )
}
