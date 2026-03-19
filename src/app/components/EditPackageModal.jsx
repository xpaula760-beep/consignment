"use client";

import { useEffect, useState } from "react";
import PackageForm from "./PackageForm";
import { fetchPackageById, updatePackage, deletePackage } from "../services/package.api";

export default function EditPackageModal({ id, onClose, onSaved }) {
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(false);
  const formId = `edit-package-form-${id}`;

  useEffect(() => {
    fetchPackageById(id).then(setPkg).catch(() => setPkg(null));
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
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 md:items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 flex max-h-dvh w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-xl sm:max-h-[90vh] sm:max-w-3xl sm:rounded-xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b bg-white px-4 py-4 md:px-6">
          <div>
            <h3 className="text-lg font-semibold">Edit Package</h3>
            <p className="text-sm text-zinc-500">Make changes and save. Scroll within this dialog on small screens.</p>
          </div>

          <button className="rounded p-2 hover:bg-zinc-100" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6">
          <div className="space-y-4 pb-2">
            <div className="pb-4 md:pb-6">
              <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                <div><span className="font-semibold">Package:</span> {pkg.itemName || "-"}</div>
                <div><span className="font-semibold">Tracking:</span> {pkg.trackingNumber || "-"}</div>
                <div><span className="font-semibold">Value:</span> {typeof pkg.totalValue !== "undefined" ? `${pkg.currency || "USD"} ${pkg.totalValue}` : "-"}</div>
                <div><span className="font-semibold">Shipping:</span> {typeof pkg.shippingCost !== "undefined" ? `${pkg.currency || "USD"} ${pkg.shippingCost}` : "-"}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
              <div className="md:col-span-1">
                <PackageForm
                  formId={formId}
                  initialData={pkg}
                  onSubmit={handleSave}
                  loading={loading}
                  submitLabel="Update package"
                  showSubmitButton={false}
                />
              </div>

              <div className="md:col-span-1 space-y-4">
                <div className="rounded border p-3">
                  <h4 className="font-medium">Preview</h4>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {pkg.images && pkg.images.length ? (
                      pkg.images.map((img, index) => (
                        <img key={index} src={img.secure_url} alt={`img-${index}`} className="h-28 w-full rounded object-cover" />
                      ))
                    ) : (
                      <div className="flex h-28 w-full items-center justify-center bg-zinc-50 text-zinc-400">No images</div>
                    )}
                  </div>

                  {pkg.videos && pkg.videos.length ? (
                    <div className="mt-4 space-y-2">
                      <h5 className="text-sm font-medium">Videos</h5>
                      {pkg.videos.map((video, index) => (
                        <video key={video.public_id || index} controls className="w-full rounded border bg-black" src={video.secure_url} />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="rounded border p-3">
                  <h4 className="font-medium">Items</h4>
                  <div className="mt-2 space-y-2">
                    {pkg.items && pkg.items.length ? pkg.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 border-b pb-2 last:border-b-0">
                        <div className="h-12 w-12 overflow-hidden rounded bg-zinc-100">
                          {item.images && item.images[0] ? (
                            <img src={item.images[0].secure_url} className="h-full w-full object-cover" alt={item.name || `Item ${index + 1}`} />
                          ) : null}
                        </div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-zinc-500">{typeof item.value !== "undefined" ? `${pkg.currency || "USD"} ${item.value}` : ""}</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-sm text-zinc-500">No items</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-zinc-100 bg-white/95 px-4 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" className="btn-danger" onClick={handleDelete} disabled={loading}>Delete</button>
            <div className="text-sm text-zinc-500">Update stays visible on mobile while you scroll through the form.</div>
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 sm:flex-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              form={formId}
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {loading ? "Saving..." : "Update package"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}