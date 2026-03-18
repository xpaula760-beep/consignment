"use client";

import { useEffect, useState } from "react";
import PackageForm from "./PackageForm";
import { fetchPackageById, updatePackage, deletePackage } from "../services/package.api";

export default function EditPackageModal({ id, onClose, onSaved }) {
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(false);

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
      <div className="relative z-10 flex max-h-dvh w-full flex-col overflow-hidden rounded-t-3xl bg-white p-4 shadow-xl sm:max-h-[90vh] sm:max-w-3xl sm:rounded-xl md:p-6">
        <button className="absolute top-3 right-3 p-2 rounded hover:bg-zinc-100" onClick={onClose} aria-label="Close">✕</button>

        <div className="space-y-4 overflow-y-auto pr-0 sm:pr-1">
          <div className="pb-4 md:pb-6">
            <h3 className="text-lg font-semibold">Edit Package</h3>
            <p className="text-sm text-zinc-500">Make changes and save. Scroll within this dialog on small screens.</p>

            <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
              <div><span className="font-semibold">Package:</span> {pkg.itemName || "—"}</div>
              <div><span className="font-semibold">Tracking:</span> {pkg.trackingNumber || "—"}</div>
              <div><span className="font-semibold">Value:</span> {(typeof pkg.totalValue !== 'undefined' ? `${pkg.currency || 'USD'} ${pkg.totalValue}` : "—")}</div>
              <div><span className="font-semibold">Shipping:</span> {typeof pkg.shippingCost !== 'undefined' ? `${pkg.currency || 'USD'} ${pkg.shippingCost}` : '—'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
            <div className="md:col-span-1">
              <PackageForm initialData={pkg} onSubmit={handleSave} loading={loading} />
            </div>

            <div className="md:col-span-1 space-y-4">
              <div className="p-3 border rounded">
                <h4 className="font-medium">Preview</h4>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {pkg.images && pkg.images.length ? (
                    pkg.images.map((img, i) => (
                      <img key={i} src={img.secure_url} alt={`img-${i}`} className="w-full h-28 object-cover rounded" />
                    ))
                  ) : (
                    <div className="w-full h-28 bg-zinc-50 flex items-center justify-center text-zinc-400">No images</div>
                  )}
                </div>

                {pkg.videos && pkg.videos.length ? (
                  <div className="mt-4 space-y-2">
                    <h5 className="text-sm font-medium">Videos</h5>
                    {pkg.videos.map((video, i) => (
                      <video key={video.public_id || i} controls className="w-full rounded border bg-black" src={video.secure_url} />
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="p-3 border rounded">
                <h4 className="font-medium">Items</h4>
                <div className="mt-2 space-y-2">
                  {pkg.items && pkg.items.length ? pkg.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-3 border-b last:border-b-0 pb-2">
                      <div className="w-12 h-12 bg-zinc-100 rounded overflow-hidden">
                        {it.images && it.images[0] ? (
                          <img src={it.images[0].secure_url} className="w-full h-full object-cover" alt={it.name || `Item ${idx + 1}`} />
                        ) : null}
                      </div>
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{it.name}</div>
                        <div className="text-zinc-500">{typeof it.value !== 'undefined' ? `${pkg.currency || 'USD'} ${it.value}` : ''}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-sm text-zinc-500">No items</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-start sm:gap-4">
            <div className="w-full sm:w-auto">
              <button className="btn-danger mr-2" onClick={handleDelete} disabled={loading}>Delete</button>
            </div>
            <div className="text-sm text-zinc-500">Use the form&apos;s Save button to persist changes.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
