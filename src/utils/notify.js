import { toast } from 'sonner';

const safeDelay = (fn) => (message, options = {}) =>
  setTimeout(() => fn(message, { ...options }), 100);

export const notify = {
  success: safeDelay(toast.success),
  error: safeDelay(toast.error),
  info: safeDelay(toast),
  promise: (promise, { loading, success, error }, options = {}) =>
    toast.promise(promise, {
      loading,
      success,
      error,
      ...options
    })
};
