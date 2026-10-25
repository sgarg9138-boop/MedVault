"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Plus,
  Minus,
  ArrowRight,
  FileCheck2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { PHARMACY_PRODUCTS } from "@/lib/mockData";
import { MedicineProduct } from "@/lib/types";

export default function PharmacyPage() {
  const { addToCart, cartCount } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "Cardiovascular", label: "Cardiovascular" },
    { id: "Diabetes Care", label: "Diabetes Care" },
    { id: "Pain Relief", label: "Pain Relief" },
    { id: "Respiratory", label: "Respiratory" },
    { id: "Vitamins & Supplements", label: "Vitamins" },
    { id: "First Aid", label: "First Aid" },
  ];

  const filteredProducts = PHARMACY_PRODUCTS.filter((prod) => {
    const matchesCategory =
      selectedCategory === "all" || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getQuantity = (id: string) => quantities[id] || 1;

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, Math.min(10, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (product: MedicineProduct) => {
    const qty = getQuantity(product.id);
    addToCart(product, qty);
    setAddedItemNotification(`Added ${qty}x ${product.name} to your cart.`);
    setTimeout(() => {
      setAddedItemNotification(null);
    }, 2800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              MedVault Pharmacy & Dispensary
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Verified Dispensary
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Order prescription refills, chronic care medications, and certified home diagnostics with doorstep delivery.
          </p>
        </div>

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View Cart ({cartCount})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Added Notification Toast */}
      {addedItemNotification && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{addedItemNotification}</span>
          </div>
          <Link href="/cart" className="text-emerald-700 underline font-bold hover:text-emerald-900">
            Proceed to Checkout →
          </Link>
        </div>
      )}

      {/* Dispensary Notice */}
      <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-950 flex items-start gap-3">
        <FileCheck2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Prescription Policy & Dispensing Protocol</p>
          <p className="text-[11px] text-teal-900 leading-relaxed">
            Medications labelled <strong>Rx Required</strong> are fulfilled only after digital verification against your active prescription records in your MedVault Vault. Over-the-counter wellness supplies ship directly.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medications by brand name, active generic compound, or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? "bg-[#0a192f] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map((product) => {
          const qty = getQuantity(product.id);
          return (
            <div
              key={product.id}
              className="rounded-2xl bg-white border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Badge Top */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {product.category}
                  </span>
                  {product.requiresRx ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Rx Required
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      OTC Available
                    </span>
                  )}
                </div>

                {/* Title & Generic */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-teal-700 font-medium mt-0.5">
                    {product.genericName} • {product.strength}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {product.packageSize}
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Quantity & Add to Cart */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-extrabold text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    In Stock
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quantity adjustment */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-800 min-w-[20px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Add button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
