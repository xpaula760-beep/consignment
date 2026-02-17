import axios from "axios";

// If NEXT_PUBLIC_API_URL is set use it; otherwise default to a relative `/api` so
// the client will call the same origin in production (avoids 'undefined' in URLs).
const rawBase = process.env.NEXT_PUBLIC_API_URL || "";
const normalizedBase = rawBase ? rawBase.replace(/\/$/, "") + "/api" : "/api";

const api = axios.create({
  baseURL: normalizedBase,
  withCredentials: true
});

/* ===========================
   PACKAGE API
=========================== */

export const fetchPackages = async () => {
  const res = await api.get("/packages");
  return res.data;
};

export const fetchPackageById = async (id) => {
  const res = await api.get(`/packages/${id}`);
  return res.data;
};

export const fetchPackageByTrackingNumber = async (trackingNumber) => {
  const res = await api.get(`/packages/track/${encodeURIComponent(trackingNumber)}`);
  return res.data;
};

export const updatePackage = async (id, formData) => {
  const res = await api.put(`/packages/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};

export const createPackage = async (formData) => {
  const res = await api.post("/packages", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};

export const updatePackageStatus = async (id, status) => {
  const res = await api.put(`/packages/${id}/status`, { status });
  return res.data;
};

export const updatePackageLocation = async (id, lat, lng) => {
  const res = await api.put(`/packages/${id}/location`, { lat, lng });
  return res.data;
};

export const deletePackage = async (id) => {
  const res = await api.delete(`/packages/${id}`);
  return res.data;
};

export const clearPackageLocation = async (id) => {
  const res = await api.delete(`/packages/${id}/location`);
  return res.data;
};
