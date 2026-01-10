"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MenuItem, MenuOption } from "@/types/menu";
import { isAuthenticated } from "@/lib/auth";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Upload,
  Image as ImageIcon,
  Home,
  LogOut,
  User,
  ArrowLeft,
} from "lucide-react";
import { categories } from "@/lib/menu-data";

export default function MenuManagementPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [migrating, setMigrating] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
    } else {
      setIsAuthChecked(true);
      fetchMenuItems();
    }
  }, [router]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/menu");
      const data = await response.json();
      if (data.success) {
        setMenuItems(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      setProcessingId(itemId);
      const response = await fetch(`/api/menu/${itemId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setMenuItems(menuItems.filter((item) => item.id !== itemId));
      } else {
        alert("Failed to delete menu item: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Failed to delete menu item");
    } finally {
      setProcessingId(null);
    }
  };

  const handleMigrate = async () => {
    if (!confirm("This will import all menu items from the static file into Firestore. Continue?")) {
      return;
    }

    try {
      setMigrating(true);
      const response = await fetch("/api/menu/migrate", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        alert(
          `Migration completed!\n` +
          `✅ ${data.stats.migrated} items migrated\n` +
          `⏭️ ${data.stats.skipped} items skipped (already exist)\n` +
          `❌ ${data.stats.errors} errors`
        );
        // Refresh the menu items list
        fetchMenuItems();
      } else {
        alert("Migration failed: " + data.error);
      }
    } catch (error) {
      console.error("Error migrating menu items:", error);
      alert("Failed to migrate menu items");
    } finally {
      setMigrating(false);
    }
  };

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Menu Management</h1>
              <p className="text-sm text-yellow-200">Add, edit, and delete menu items</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 bg-yellow-500 text-primary px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Orders
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                <Home className="w-5 h-5" />
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold text-gray-700">Filter by Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              {menuItems.length === 0 && (
                <button
                  onClick={handleMigrate}
                  disabled={migrating}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Import existing menu items from static file to Firestore"
                >
                  {migrating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Migrating...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Import Existing Menu
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <Plus className="w-5 h-5" />
                Add Menu Item
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No menu items found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition mx-auto"
            >
              <Plus className="w-5 h-5" />
              Add Your First Menu Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={() => setEditingItem(item)}
                onDelete={() => handleDelete(item.id)}
                isProcessing={processingId === item.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <MenuItemModal
          item={editingItem}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSave={() => {
            fetchMenuItems();
            setShowAddModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  isProcessing: boolean;
}

function MenuItemCard({ item, onEdit, onDelete, isProcessing }: MenuItemCardProps) {
  const categoryName = categories.find((c) => c.id === item.category)?.name || item.category;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-200 hover:shadow-lg transition">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/logo.png";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
        {item.available === false && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Unavailable
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{categoryName}</p>
          </div>
          <span className="text-xl font-bold text-primary">£{item.price.toFixed(2)}</span>
        </div>

        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onEdit}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MenuItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onSave: () => void;
}

function MenuItemModal({ item, onClose, onSave }: MenuItemModalProps) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || 0,
    category: item?.category || "sides",
    imageUrl: item?.imageUrl || "",
    available: item?.available !== undefined ? item.available : true,
    options: item?.options || [] as MenuOption[],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(item?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingOption, setEditingOption] = useState<number | null>(null);
  const [newOptionName, setNewOptionName] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      alert("Please select an image file first");
      return;
    }

    try {
      setUploading(true);
      console.log("📤 Starting image upload...");
      console.log("📄 File details:", {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
      });
      
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);

      console.log("📡 Sending request to /api/menu/upload...");
      const response = await fetch("/api/menu/upload", {
        method: "POST",
        body: uploadFormData,
      });

      console.log("📥 Response status:", response.status, response.statusText);
      const data = await response.json();
      console.log("📥 Upload response data:", data);
      
      if (data.success) {
        console.log("✅ Upload successful! Image URL:", data.imageUrl);
        setFormData({ ...formData, imageUrl: data.imageUrl });
        setImagePreview(data.imageUrl); // Update preview with the actual URL
        alert(`Image uploaded successfully!\nURL: ${data.imageUrl}`);
      } else {
        const errorMsg = data.error || "Unknown error";
        const details = data.details ? ` (${data.details})` : "";
        console.error("❌ Upload failed:", data);
        alert(`Failed to upload image: ${errorMsg}${details}\n\nCheck browser console and server terminal for details.`);
      }
    } catch (error: any) {
      console.error("❌ Error uploading image:", error);
      console.error("Error stack:", error.stack);
      alert(`Failed to upload image: ${error.message || "Network error"}\n\nCheck browser console for details.`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddOption = () => {
    if (!newOptionName.trim()) return;
    setFormData({
      ...formData,
      options: [
        ...formData.options,
        { name: newOptionName, choices: [] },
      ],
    });
    setNewOptionName("");
  };

  const handleRemoveOption = (index: number) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    });
  };

  const handleAddChoice = (optionIndex: number, label: string, price: number = 0) => {
    const newOptions = [...formData.options];
    newOptions[optionIndex].choices.push({ label, price });
    setFormData({ ...formData, options: newOptions });
  };

  const handleRemoveChoice = (optionIndex: number, choiceIndex: number) => {
    const newOptions = [...formData.options];
    newOptions[optionIndex].choices = newOptions[optionIndex].choices.filter(
      (_, i) => i !== choiceIndex
    );
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    // Block saving if image file is selected but not uploaded
    if (imageFile && !formData.imageUrl) {
      alert(
        "⚠️ IMAGE NOT UPLOADED!\n\n" +
        "You have selected an image file but haven't uploaded it yet.\n\n" +
        "Please:\n" +
        "1. Click the 'Upload Image' button (blue button)\n" +
        "2. Wait for the success message\n" +
        "3. Then click 'Add Item' or 'Update Item'\n\n" +
        "The image will NOT be saved if you proceed without uploading."
      );
      return; // Block the save
    }

    console.log("💾 Saving menu item with data:", {
      name: formData.name,
      price: formData.price,
      category: formData.category,
      imageUrl: formData.imageUrl || "(none - no image uploaded)",
    });

    try {
      setSaving(true);
      const url = item ? `/api/menu/${item.id}` : "/api/menu";
      const method = item ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("💾 Save response:", data);
      
      if (data.success) {
        console.log("✅ Menu item saved successfully!");
        onSave();
      } else {
        console.error("❌ Save failed:", data);
        alert("Failed to save menu item: " + data.error);
      }
    } catch (error) {
      console.error("❌ Error saving menu item:", error);
      alert("Failed to save menu item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {item ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Image {imageFile && !formData.imageUrl && (
                <span className="text-red-600 font-bold">⚠️ UPLOAD REQUIRED!</span>
              )}
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {imageFile && (
                  <div className="mt-2 space-y-2">
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      disabled={uploading}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? "Uploading..." : "📤 Upload Image (REQUIRED!)"}
                    </button>
                    {!formData.imageUrl && (
                      <p className="text-sm text-red-600 font-semibold">
                        ⚠️ You must click "Upload Image" before saving!
                      </p>
                    )}
                    {formData.imageUrl && (
                      <p className="text-sm text-green-600 font-semibold">
                        ✅ Image uploaded successfully!
                      </p>
                    )}
                  </div>
                )}
              </div>
              {imagePreview && (
                <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            {formData.imageUrl && (
              <p className="text-sm text-gray-500 mt-2">
                ✅ Uploaded: {formData.imageUrl.substring(0, 60)}...
              </p>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (£) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-gray-700">Item is available for ordering</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customization Options
            </label>
            <div className="space-y-4">
              {formData.options.map((option, optionIndex) => (
                <div key={optionIndex} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{option.name}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(optionIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {option.choices.map((choice, choiceIndex) => (
                      <div key={choiceIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={choice.label}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[optionIndex].choices[choiceIndex].label = e.target.value;
                            setFormData({ ...formData, options: newOptions });
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
                          placeholder="Choice label"
                        />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={choice.price || 0}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[optionIndex].choices[choiceIndex].price = parseFloat(e.target.value) || 0;
                            setFormData({ ...formData, options: newOptions });
                          }}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
                          placeholder="Price"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveChoice(optionIndex, choiceIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddChoice(optionIndex, "", 0)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Choice
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  placeholder="New option name (e.g., Size, Toppings)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Add Option
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : item ? "Update Item" : "Add Item"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
