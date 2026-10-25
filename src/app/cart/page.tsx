"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Truck,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { checkoutSchema, CheckoutInput } from "@/lib/validations";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal, placeOrder, patient } = useStore();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const deliveryFee = cartTotal > 50 || cartTotal === 0 ? 0.0 : 4.99;
  const grandTotal = cartTotal > 0 ? cartTotal + deliveryFee : 0;

  // Form State
  const [formData, setFormData] = useState<CheckoutInput>({
    fullName: patient.fullName,
    phone: patient.emergencyContact.phone,
    street: "742 Evergreen Terrace, Apt 4B",
    city: "Springfield",
    state: "OR",
    zipCode: "97477",
    paymentMethod: "card",
    prescriptionConfirmed: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const hasRxItems = cart.some((item) => item.product.requiresRx);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkoutSchema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    placeOrder({
      items: [...cart],
      subtotal: cartTotal,
      deliveryFee,
      total: grandTotal,
      shippingAddress: {
        fullName: formData.fullName,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone,
      },
      paymentMethod:
        formData.paymentMethod === "card"
          ? "Visa ending in •••• 4242 (Simulated)"
          : formData.paymentMethod === "insurance"
          ? "Apex Health Insurance Co-pay (Simulated)"
          : "Cash on Delivery",
    });

    setCheckoutModalOpen(false);
    router.push("/orders");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Your Cart is Empty</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You have no items in your pharmacy cart. Browse our certified dispensary to order refills or diagnostic devices.
        </p>
        <div className="pt-2">
          <Link
            href="/pharmacy"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Browse Medicine Store</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Pharmacy Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your order before proceeding to simulated clinical fulfillment.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-slate-500 hover:text-rose-600 transition-colors"
        >
          Clear all items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {hasRxItems && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Prescription Notice:</strong> Your cart includes prescription-grade items. In production, these are matched automatically against your vaulted doctor orders.
              </p>
            </div>
          )}

          <div className="rounded-2xl bg-white border border-slate-200 shadow-xs divide-y divide-slate-100">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.product.category}
                    </span>
                    {item.product.requiresRx && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        Rx Required
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.product.name}</h3>
                  <p className="text-xs text-slate-500">
                    {item.product.genericName} • {item.product.strength} ({item.product.packageSize})
                  </p>
                  <p className="text-xs font-semibold text-teal-700">
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800 min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-slate-900 min-w-[65px] text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/pharmacy"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
          >
            ← Add more items from Pharmacy
          </Link>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span>{deliveryFee === 0 ? "FREE (Orders > $50)" : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Pharmacist Review Fee</span>
                <span className="text-emerald-700 font-medium">Included ($0.00)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
              <span className="text-sm font-bold">Total Due</span>
              <span className="text-xl font-extrabold text-teal-700">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-400">
              <p className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Cold-chain packaging for temperature-sensitive items.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Simulated payment test mode.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Simulated Pharmacy Checkout
                </h3>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Payment Notice */}
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Demo Checkout:</strong> No real money or card transaction will occur. This simulator generates an active order tracking ticket in your profile.
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              {/* Full Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                  {formErrors.fullName && (
                    <p className="text-rose-600 text-[11px] mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                  {formErrors.phone && (
                    <p className="text-rose-600 text-[11px] mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
                {formErrors.street && (
                  <p className="text-rose-600 text-[11px] mt-1">{formErrors.street}</p>
                )}
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Postal/ZIP *</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "card" })}
                      className="text-teal-600"
                    />
                    <span className="font-semibold text-slate-700">Test Card (4242)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="insurance"
                      checked={formData.paymentMethod === "insurance"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "insurance" })}
                      className="text-teal-600"
                    />
                    <span className="font-semibold text-slate-700">Insurance Co-Pay</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "cod" })}
                      className="text-teal-600"
                    />
                    <span className="font-semibold text-slate-700">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {/* Total Summary Row */}
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Order Total to Authorize:</span>
                <span className="text-base font-extrabold text-teal-700">${grandTotal.toFixed(2)}</span>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Place Simulated Order
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
