"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProfileModal({
  open,
  onClose,
  initialName = "",
  initialImage = "",
  onSave,
}) {
  const [name, setName] = useState(initialName);
  const [imagePreview, setImagePreview] = useState(initialImage);

  if (!open) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleSave = () => {
    onClose();
  };
  console.log(initialName);
  const isEditMode = !!initialName && !!initialImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div
        className="w-[90%] max-w-md rounded-2xl p-6 shadow-2xl
        bg-white dark:bg-neutral-900
        text-neutral-900 dark:text-neutral-100
        border border-neutral-200 dark:border-neutral-700"
      >
        <h2 className="text-xl font-semibold mb-6">
          {isEditMode ? "Update Profile" : "Create Profile"}
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="relative w-28 h-28">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="profile"
                fill
                className="rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center text-3xl">
                👤
              </div>
            )}
          </div>

          <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
            Change Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm mb-2">Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg px-3 py-2 outline-none border
              border-neutral-300 dark:border-neutral-700
              bg-white dark:bg-neutral-800
              text-neutral-900 dark:text-neutral-100
              focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {/* Cancel */}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border
              border-neutral-300 dark:border-neutral-600
              hover:bg-neutral-100 dark:hover:bg-neutral-800
              transition"
          >
            Cancel
          </button>

          {/* Create / Update */}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white
              hover:bg-blue-700 transition"
          >
            {isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
