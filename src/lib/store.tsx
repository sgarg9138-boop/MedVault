"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CartItem,
  MedicalRecord,
  Medication,
  MedicineProduct,
  Order,
  PatientProfile,
  ShareLink,
} from "./types";
import {
  INITIAL_MEDICATIONS,
  INITIAL_ORDERS,
  INITIAL_PATIENT,
  INITIAL_RECORDS,
  INITIAL_SHARES,
} from "./mockData";
import { isSupabaseConfigured } from "./supabase/client";

interface StoreContextType {
  patient: PatientProfile;
  updatePatient: (updated: Partial<PatientProfile>) => void;
  records: MedicalRecord[];
  addRecord: (record: Omit<MedicalRecord, "id">) => void;
  deleteRecord: (id: string) => void;
  medications: Medication[];
  toggleMedicationTaken: (id: string) => void;
  addMedication: (med: Omit<Medication, "id" | "isTakenToday" | "takenHistory">) => void;
  deleteMedication: (id: string) => void;
  cart: CartItem[];
  addToCart: (product: MedicineProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  orders: Order[];
  placeOrder: (orderData: Omit<Order, "id" | "date" | "status" | "trackingNumber" | "estimatedDelivery">) => Order;
  shareLinks: ShareLink[];
  addShareLink: (link: Omit<ShareLink, "id" | "createdAt" | "viewCount" | "isActive">) => ShareLink;
  revokeShareLink: (id: string) => void;
  isSupabaseConnected: boolean;
  activeAnalyzerRecord: MedicalRecord | null;
  setActiveAnalyzerRecord: (rec: MedicalRecord | null) => void;
  resetToDemoDefaults: () => void;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  patient: "medvault_patient_v1",
  records: "medvault_records_v1",
  medications: "medvault_medications_v1",
  cart: "medvault_cart_v1",
  orders: "medvault_orders_v1",
  shares: "medvault_shares_v1",
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [records, setRecords] = useState<MedicalRecord[]>(INITIAL_RECORDS);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>(INITIAL_SHARES);
  const [activeAnalyzerRecord, setActiveAnalyzerRecord] = useState<MedicalRecord | null>(INITIAL_RECORDS[0]);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedPatient = localStorage.getItem(STORAGE_KEYS.patient);
      if (savedPatient) setPatient(JSON.parse(savedPatient));

      const savedRecords = localStorage.getItem(STORAGE_KEYS.records);
      if (savedRecords) setRecords(JSON.parse(savedRecords));

      const savedMeds = localStorage.getItem(STORAGE_KEYS.medications);
      if (savedMeds) setMedications(JSON.parse(savedMeds));

      const savedCart = localStorage.getItem(STORAGE_KEYS.cart);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.orders);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedShares = localStorage.getItem(STORAGE_KEYS.shares);
      if (savedShares) setShareLinks(JSON.parse(savedShares));
    } catch {
      // LocalStorage access failure fallback
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.patient, JSON.stringify(patient));
      localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records));
      localStorage.setItem(STORAGE_KEYS.medications, JSON.stringify(medications));
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEYS.shares, JSON.stringify(shareLinks));
    } catch {
      // ignore
    }
  }, [patient, records, medications, cart, orders, shareLinks, isInitialized]);

  const updatePatient = (updated: Partial<PatientProfile>) => {
    setPatient((prev) => ({ ...prev, ...updated }));
  };

  const addRecord = (newRec: Omit<MedicalRecord, "id">) => {
    const id = `rec-${Date.now().toString().slice(-4)}`;
    const fullRecord: MedicalRecord = { id, ...newRec };
    setRecords((prev) => [fullRecord, ...prev]);
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleMedicationTaken = (id: string) => {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextTaken = !m.isTakenToday;
          return {
            ...m,
            isTakenToday: nextTaken,
            takenHistory: [
              { date: new Date().toISOString().split("T")[0], taken: nextTaken },
              ...m.takenHistory.filter((h) => h.date !== new Date().toISOString().split("T")[0]),
            ],
          };
        }
        return m;
      })
    );
  };

  const addMedication = (med: Omit<Medication, "id" | "isTakenToday" | "takenHistory">) => {
    const newMed: Medication = {
      id: `med-${Date.now().toString().slice(-4)}`,
      ...med,
      isTakenToday: false,
      takenHistory: [],
    };
    setMedications((prev) => [newMed, ...prev]);
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const addToCart = (product: MedicineProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = (
    orderData: Omit<Order, "id" | "date" | "status" | "trackingNumber" | "estimatedDelivery">
  ): Order => {
    const id = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date().toISOString().split("T")[0];
    const newOrder: Order = {
      id,
      date: today,
      status: "Processing",
      trackingNumber: `MV-IND-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: "Expected in 2 business days",
      ...orderData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const addShareLink = (
    link: Omit<ShareLink, "id" | "createdAt" | "viewCount" | "isActive">
  ): ShareLink => {
    const newLink: ShareLink = {
      id: `sh-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split("T")[0],
      viewCount: 0,
      isActive: true,
      ...link,
    };
    setShareLinks((prev) => [newLink, ...prev]);
    return newLink;
  };

  const revokeShareLink = (id: string) => {
    setShareLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isActive: false } : l))
    );
  };

  const resetToDemoDefaults = () => {
    setPatient(INITIAL_PATIENT);
    setRecords(INITIAL_RECORDS);
    setMedications(INITIAL_MEDICATIONS);
    setCart([]);
    setOrders(INITIAL_ORDERS);
    setShareLinks(INITIAL_SHARES);
    setActiveAnalyzerRecord(INITIAL_RECORDS[0]);
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  };

  return (
    <StoreContext.Provider
      value={{
        patient,
        updatePatient,
        records,
        addRecord,
        deleteRecord,
        medications,
        toggleMedicationTaken,
        addMedication,
        deleteMedication,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        orders,
        placeOrder,
        shareLinks,
        addShareLink,
        revokeShareLink,
        isSupabaseConnected: isSupabaseConfigured,
        activeAnalyzerRecord,
        setActiveAnalyzerRecord,
        resetToDemoDefaults,
        isSosModalOpen,
        setIsSosModalOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
