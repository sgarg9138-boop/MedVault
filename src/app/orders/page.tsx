"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  RotateCw,
  ShoppingBag,
} from "lucide-react";
import { useStore } from "@/lib/store";

export default function OrdersPage() {
  const { orders, addToCart } = useStore();

  const getStatusStep = (status: string) => {
    switch (status) {
      case "Processing":
        return 1;
      case "Pharmacist Review":
        return 2;
      case "Dispatched":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Package className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Prescription Orders & Deliveries
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time clinical dispensary orders, cold-chain transport, and pharmacist reviews.
          </p>
        </div>

        <Link
          href="/pharmacy"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>New Pharmacy Order</span>
        </Link>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const step = getStatusStep(order.status);
          return (
            <div
              key={order.id}
              className="rounded-2xl bg-white border border-slate-200 shadow-xs p-6 space-y-6"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{order.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Placed on {order.date} • Tracking:{" "}
                    <span className="font-mono text-slate-700">{order.trackingNumber}</span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-extrabold text-teal-700">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-slate-500">{order.estimatedDelivery}</p>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-2">
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="space-y-1">
                    <div
                      className={`h-2 rounded-full transition-colors ${
                        step >= 1 ? "bg-teal-600" : "bg-slate-200"
                      }`}
                    />
                    <span className={step >= 1 ? "font-bold text-teal-900" : "text-slate-400"}>
                      1. Order Placed
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`h-2 rounded-full transition-colors ${
                        step >= 2 ? "bg-teal-600" : "bg-slate-200"
                      }`}
                    />
                    <span className={step >= 2 ? "font-bold text-teal-900" : "text-slate-400"}>
                      2. Pharmacist Review
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`h-2 rounded-full transition-colors ${
                        step >= 3 ? "bg-teal-600" : "bg-slate-200"
                      }`}
                    />
                    <span className={step >= 3 ? "font-bold text-teal-900" : "text-slate-400"}>
                      3. In Transit
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`h-2 rounded-full transition-colors ${
                        step >= 4 ? "bg-teal-600" : "bg-slate-200"
                      }`}
                    />
                    <span className={step >= 4 ? "font-bold text-emerald-900" : "text-slate-400"}>
                      4. Delivered
                    </span>
                  </div>
                </div>
              </div>

              {/* Items & Shipping Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 text-xs">
                {/* Items */}
                <div className="md:col-span-7 space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    Prescription & Supplies Manifest
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{item.product.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {item.product.strength} • Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-slate-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Delivery Destination
                    </span>
                    <p className="font-bold text-slate-800">{order.shippingAddress.fullName}</p>
                    <p className="text-slate-600">{order.shippingAddress.street}</p>
                    <p className="text-slate-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                      Payment Settlement
                    </span>
                    <p className="font-medium text-slate-700">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Reorder Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    order.items.forEach((item) => addToCart(item.product, item.quantity));
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Reorder These Items</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
