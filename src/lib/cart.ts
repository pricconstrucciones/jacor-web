"use client";
// Carrito: vive solo en el navegador del visitante (sin cuenta). Guarda producto, color, talle, cantidad y nota.
import { useSyncExternalStore } from "react";

export type CartItem = { slug: string; code?: string; name: string; color: string | null; colorPending?: boolean; size: string | null; quantity: number; notes: string | null };

const KEY = "jacor.solicitud.v1";
const EVENT = "jacor-cart";
export const MAX_ITEMS = 50;
export const MAX_QTY = 100000;

function read(): CartItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

let snapshot: CartItem[] | null = null;
const EMPTY: CartItem[] = [];

function write(items: CartItem[]) {
  snapshot = items;
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* almacenamiento no disponible: queda en memoria */ }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { snapshot = null; cb(); } };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener("storage", onStorage); };
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, () => (snapshot ??= read()), () => EMPTY);
}

const same = (a: CartItem, b: CartItem) => a.slug === b.slug && a.color === b.color && a.size === b.size && (a.notes ?? "") === (b.notes ?? "");

/** Agrega un renglón; si ya existe el mismo producto, color, talle y nota, suma la cantidad. */
export function addToCart(item: CartItem): string | null {
  const items = read();
  const i = items.findIndex((x) => same(x, item));
  if (i >= 0) items[i] = { ...items[i], quantity: Math.min(MAX_QTY, items[i].quantity + item.quantity) };
  else if (items.length >= MAX_ITEMS) return `La solicitud admite hasta ${MAX_ITEMS} renglones.`;
  else items.push(item);
  write(items);
  return null;
}

export function updateQuantity(index: number, quantity: number) {
  const items = read();
  if (!items[index]) return;
  items[index] = { ...items[index], quantity: Math.max(1, Math.min(MAX_QTY, Math.trunc(quantity) || 1)) };
  write(items);
}

export function removeFromCart(index: number) {
  write(read().filter((_, i) => i !== index));
}

export function clearCart() {
  write([]);
}
