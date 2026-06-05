"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Produit = {
  id: string;
  label: string;
  desc: string;
  prix: number;
  unite: string;
  images: string[];
  categorie: string;
};

type CartItem = { produit: Produit; qty: number };

type CartContextType = {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (p: Produit) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "cotiere_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  function addToCart(p: Produit) {
    setCart(prev => {
      const ex = prev.find(i => i.produit.id === p.id);
      if (ex) return prev.map(i => i.produit.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { produit: p, qty: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart(prev =>
      prev.map(i => i.produit.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
          .filter(i => i.qty > 0)
    );
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.produit.prix * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
