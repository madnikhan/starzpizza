"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import type { Banner } from "@/types/banner";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Upload,
  Image as ImageIcon,
  Video,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ImagePlus,
} from "lucide-react";

export default function BannersManagementPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    type: "image" as "image" | "video",
    url: "",
    title: "",
    subtitle: "",
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
    } else {
      setIsAuthChecked(true);
      fetchBanners();
    }
  }, [router]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/banners");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBanners(data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: "image",
      url: "",
      title: "",
      subtitle: "",
    });
    setUploadFile(null);
    setEditingBanner(null);
    setShowAddModal(false);
  };

  const handleUpload = async (): Promise<string | null> => {
    if (!uploadFile) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", uploadFile);
      const res = await fetch("/api/banners/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
      alert(data.error || "Upload failed");
      return null;
    } catch (e) {
      console.error(e);
      alert("Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    let url = formData.url.trim();
    if (uploadFile) {
      const uploadedUrl = await handleUpload();
      if (!uploadedUrl) return;
      url = uploadedUrl;
    }
    if (!url || !formData.title.trim()) {
      alert("Please enter a URL (or upload a file) and title.");
      return;
    }

    const payload = {
      type: formData.type,
      url,
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
    };

    try {
      setProcessingId(editingBanner?.id ?? "new");
      if (editingBanner) {
        const res = await fetch(`/api/banners/${editingBanner.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          fetchBanners();
          resetForm();
        } else {
          alert(data.error || "Update failed");
        }
      } else {
        const res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, order: banners.length }),
        });
        const data = await res.json();
        if (data.success) {
          fetchBanners();
          resetForm();
        } else {
          alert(data.error || "Create failed");
        }
      }
    } catch (e) {
      console.error(e);
      alert("Request failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      setProcessingId(id);
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    } finally {
      setProcessingId(null);
    }
  };

  const moveBanner = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;
    const reordered = [...banners];
    const a = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = a;
    const orderedIds = reordered.map((b) => b.id);
    try {
      const res = await fetch("/api/banners/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      const data = await res.json();
      if (data.success) {
        setBanners(reordered);
      } else {
        alert(data.error || "Reorder failed");
      }
    } catch (e) {
      console.error(e);
      alert("Reorder failed");
    }
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      type: banner.type,
      url: banner.url,
      title: banner.title,
      subtitle: banner.subtitle ?? "",
    });
    setUploadFile(null);
  };

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white shadow">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold">Manage Banners</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Add or change hero banner images and videos shown on the homepage.
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            <Plus size={20} />
            Add Banner
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Loading banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <ImagePlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No banners yet.</p>
            <p className="text-sm text-gray-500 mb-4">
              The homepage hero will use default slides until you add banners here.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              Add first banner
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className="bg-white rounded-lg shadow flex flex-wrap items-stretch overflow-hidden"
              >
                <div className="w-48 h-32 flex-shrink-0 bg-gray-200 relative">
                  {banner.type === "video" ? (
                    <video
                      src={banner.url}
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={banner.url}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-1 left-1 px-2 py-0.5 rounded text-xs font-medium bg-black/70 text-white">
                    {banner.type}
                  </span>
                </div>
                <div className="flex-1 min-w-0 p-4 flex flex-col justify-center">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-sm text-gray-600 truncate">
                      {banner.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Order: {index + 1}
                  </p>
                </div>
                <div className="flex items-center gap-2 p-4 border-l border-gray-100">
                  <button
                    onClick={() => moveBanner(index, "up")}
                    disabled={index === 0}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
                    title="Move up"
                  >
                    <ArrowUp size={18} />
                  </button>
                  <button
                    onClick={() => moveBanner(index, "down")}
                    disabled={index === banners.length - 1}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
                    title="Move down"
                  >
                    <ArrowDown size={18} />
                  </button>
                  <button
                    onClick={() => openEdit(banner)}
                    className="p-2 rounded hover:bg-blue-50 text-blue-600"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    disabled={processingId === banner.id}
                    className="p-2 rounded hover:bg-red-50 text-red-600 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingBanner) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editingBanner ? "Edit Banner" : "Add Banner"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 rounded hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={formData.type === "image"}
                      onChange={() =>
                        setFormData((p) => ({ ...p, type: "image" }))
                      }
                    />
                    <ImageIcon size={18} />
                    Image
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={formData.type === "video"}
                      onChange={() =>
                        setFormData((p) => ({ ...p, type: "video" }))
                      }
                    />
                    <Video size={18} />
                    Video
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media URL (or upload below)
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, url: e.target.value }))
                  }
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or upload file ({formData.type === "image" ? "image" : "video"})
                </label>
                <input
                  type="file"
                  accept={
                    formData.type === "image"
                      ? "image/jpeg,image/png,image/webp"
                      : "video/mp4,video/webm"
                  }
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {uploadFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    {uploadFile.name} – will replace URL on save
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. Smash Burgers"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle (optional)
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, subtitle: e.target.value }))
                  }
                  placeholder="e.g. Perfectly Smashed"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-2">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  processingId !== null || uploading ||
                  (!formData.url.trim() && !uploadFile) ||
                  !formData.title.trim()
                }
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {uploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Save size={18} />
                    {editingBanner ? "Update" : "Add Banner"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
