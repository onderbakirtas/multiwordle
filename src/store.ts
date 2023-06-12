import { writable, type Writable } from "svelte/store";
import type { TToast } from "./types";

export const toasts: Writable<TToast[]> = writable([]);

export const addToast = (toast: TToast) => {
  // Create a unique ID so we can easily find/remove it
  // if it is dismissible/has a timeout.
  const id = Math.floor(Math.random() * 10000);

  // Setup some sensible defaults for a toast.
  const defaults: TToast = {
    id,
  };

  // Push the toast to the top of the list of toasts
  toasts.update((all) => [{ ...defaults, ...toast }, ...all]);
};

export const dismissToast = (id: number) => {
  toasts.update((all) => all.filter((t) => t.id !== id));
};
