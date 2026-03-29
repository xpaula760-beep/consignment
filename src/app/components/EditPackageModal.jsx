"use client";

import { useEffect, useState } from "react";
import PackageForm from "./PackageForm";
import { fetchPackageById, updatePackage, deletePackage } from "../services/package.api";

export default function EditPackageModal({ id, onClose, onSaved }) {
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(false);
  const formId = `edit-package-form-${id}`;

  useEffect(() => {
    fetchPackageById(id)
      .then(setPkg)
      .catch(() => setPkg(null));
  }, [id]);

  const handleSave = async (formData) => {
    setLoading(true);
    try {
      await updatePackage(id, formData);
      onSaved && onSaved();
      onClose && onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this package?")) return;
    setLoading(true);
    try {
      await deletePackage(id);
      onSaved && onSaved();
      onClose && onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!pkg) return null;

  return (
    // 1. OVERLAY & POSITIONING: Bottom sheet on mobile, centered modal on sm+
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* 2. MODAL CONTAINER: Max-height for scrolling, wider on large screens to support 2 columns */}
      <div className="relative z-10 flex w-full max-h-[100dvh] flex-col overflow-hidden bg-white shadow-2xl rounded-t-3xl sm:max-h-[90vh] sm:max-w-4xl lg:max-w-5xl sm:rounded-2xl">
        
        {/* HEADER */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-zinc-100 bg-white px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Edit Package</h3>
            <p className="text-sm text-zinc-500">Make changes and save. Scroll to view all details.</p>
          </div>
          <button 
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors" 
            onClick={onClose} 
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          
          {/* Top Info Bar */}
          <div className="mb-6 rounded-lg bg-zinc-50 p-4 border border-zinc-100">
            <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
              <div><span className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Package</span> <span className="font-medium text-zinc-900">{pkg.itemName || "-"}</span></div>
              <div><span className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Tracking</span> <span className="font-medium text-zinc-900">{pkg.trackingNumber || "-"}</span></div>
              <div><span className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Value</span> <span className="font-medium text-zinc-900">{typeof pkg.totalValue !== "undefined" ? `${pkg.currency || "USD"} ${pkg.totalValue}` : "-"}</span></div>
              <div><span className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Shipping</span> <span className="font-medium text-zinc-900">{typeof pkg.shippingCost !== "undefined" ? `${pkg.currency || "USD"} ${pkg.shippingCost}` : "-"}</span></div>
            </div>
          </div>

          {/* MAIN LAYOUT: Stacks on mobile, splits into 2 columns on lg screens */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            
            {/* Left Column: Form */}
            <div className="order-2 lg:order-1">
              <PackageForm
                formId={formId}
                initialData={pkg}
                onSubmit={handleSave}
                loading={loading}
                submitLabel="Update package"
                showSubmitButton={false}
              />
            </div>

            {/* Right Column: Preview & Items */}
            <div className="order-1 flex flex-col gap-5 lg:order-2">
              
              {/* Preview Images/Videos */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <h4 className="font-medium text-zinc-900 border-b border-zinc-100 pb-2 mb-3">Media Preview</h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                  {pkg.images && pkg.images.length ? (
                    pkg.images.map((img, index) => (
                      <img key={index} src={img.secure_url} alt={`img-${index}`} className="aspect-square w-full rounded-lg object-cover border border-zinc-100" />
                    ))
                  ) : (
                    <div className="col-span-full flex h-24 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-400">No images available</div>
                  )}
                </div>

                {pkg.videos && pkg.videos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {pkg.videos.map((video, index) => (
                      <video key={video.public_id || index} controls className="w-full rounded-lg border border-zinc-200 bg-black aspect-video object-contain" src={video.secure_url} />
                    ))}
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <h4 className="font-medium text-zinc-900 border-b border-zinc-100 pb-2 mb-3">Package Contents</h4>
                <div className="space-y-3">
                  {pkg.items && pkg.items.length ? pkg.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-zinc-100 bg-zinc-50 relative">
                        {item.images && item.images.length ? (
                          <img src={item.images[0].secure_url} className="h-full w-full object-cover" alt={item.name || `Item ${index + 1}`} />
                        ) : null}

                        {item.images && item.images.length > 1 && (
                          <div className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-zinc-900 text-white text-xs font-medium px-2 py-0.5 border border-white/20">
                            {item.images.length}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm font-medium text-zinc-900">{item.name}</div>
                        <div className="text-xs text-zinc-500">{typeof item.value !== "undefined" ? `${pkg.currency || "USD"} ${item.value}` : "No value specified"}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-sm text-zinc-500 text-center py-4">No items listed</div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* STICKY FOOTER: Highly responsive button layout */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-zinc-100 bg-zinc-50/80 px-5 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
          
          {/* Delete Action: Bottom on mobile, left on desktop */}
          <div className="order-2 flex justify-center sm:order-1 sm:block">
            <button 
              type="button" 
              className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline disabled:opacity-50" 
              onClick={handleDelete} 
              disabled={loading}
            >
              Delete this package
            </button>
          </div>

          {/* Primary Actions: Top on mobile (easier reach), right on desktop */}
          <div className="order-1 flex w-full gap-3 sm:order-2 sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 sm:flex-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              form={formId}
              disabled={loading}
              className="flex-1 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none"
            >
              {loading ? "Saving..." : "Update Package"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}