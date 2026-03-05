// ─────────────────────────────────────────────────────────
// Lightweight toast system — no external library needed.
// Usage: import { useToast } from "./Toast"
//        const { toast } = useToast()
//        toast.success("Post created!")
// ─────────────────────────────────────────────────────────

import { create } from "zustand";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id:      string;
  message: string;
  type:    ToastType;
};

type ToastStore = {
  toasts: ToastItem[];
  add:    (message: string, type: ToastType) => void;
  remove: (id: string) => void;
};

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    // Auto-remove after 3.5s
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// ── Public hook ───────────────────────────────────────────
export function useToast() {
  const add = useToastStore((s) => s.add);
  return {
    toast: {
      success: (msg: string) => add(msg, "success"),
      error:   (msg: string) => add(msg, "error"),
      info:    (msg: string) => add(msg, "info"),
    },
  };
}

// ── Toast Container (add once to AppLayout) ───────────────
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3
            rounded-xl shadow-lg text-sm font-medium text-white
            cursor-pointer select-none
            animate-slide-up
            ${t.type === "success" ? "bg-green-600" :
              t.type === "error"   ? "bg-red-600"   :
                                     "bg-gray-800"}
          `}
        >
          <span>
            {t.type === "success" ? "✓" :
             t.type === "error"   ? "✕" : "ℹ"}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}