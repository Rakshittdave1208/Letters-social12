// src/features/profile/EditProfilePage.tsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../../lib/firebase";
import { useAuth } from "../auth/hooks/useAuth";
import { useAuthStore } from "../auth/auth.store";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function getAvatarColor(name: string) {
  const colors = ["from-blue-500 to-indigo-600","from-purple-500 to-pink-600","from-green-500 to-teal-600","from-orange-500 to-red-600","from-cyan-500 to-blue-600"];
  return colors[name.charCodeAt(0) % colors.length];
}

export default function EditProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [name,     setName]     = useState(user?.name ?? "");
  const [bio,      setBio]      = useState("");
  const [preview,  setPreview]  = useState<string | null>(user?.photoURL ?? null);
  const [file,     setFile]     = useState<File | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!user || !auth.currentUser) return;
    if (!name.trim()) { setError("Name cannot be empty"); return; }
    setLoading(true);
    setError("");

    try {
      let photoURL = user.photoURL;

      // Upload photo if changed
      if (file) {
        const storage   = getStorage();
        const storageRef = ref(storage, `avatars/${user.id}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: name.trim(),
        photoURL:    photoURL ?? undefined,
      });

      // Update Zustand store
      useAuthStore.setState((s) => ({
        user: s.user ? { ...s.user, name: name.trim(), photoURL } : null,
      }));

      // Update author name on all posts
      const postsQ = query(collection(db, "posts"), where("userId", "==", user.id));
      const postsSnap = await getDocs(postsQ);
      const batch = writeBatch(db);
      postsSnap.docs.forEach((d) => {
        batch.update(d.ref, { author: name.trim() });
      });
      await batch.commit();

      navigate("/profile");
    } catch (err: any) {
      setError(err.message ?? "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate("/profile")}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-lg"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-6">

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative cursor-pointer group"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-white dark:ring-gray-900" />
            ) : (
              <div className={`w-24 h-24 rounded-full bg-linear-to-br ${getAvatarColor(name)} text-white flex items-center justify-center text-2xl font-bold ring-4 ring-white dark:ring-gray-900`}>
                {getInitials(name)}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-2xl">📷</span>
            </div>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium transition"
          >
            Change photo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            Display Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            Bio <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
            rows={3}
            placeholder="Tell people about yourself..."
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 transition-colors resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{bio.length}/160</p>
        </div>

        {/* Email (read only) */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
          <input
            value={user?.email ?? ""}
            disabled
            className="w-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate("/profile")}
            className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !name.trim()}
            className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-2xl hover:opacity-90 transition disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-400 border-t-white dark:border-t-gray-900 rounded-full animate-spin" />
                Saving...
              </span>
            ) : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Note about photo storage */}
      <p className="text-xs text-center text-gray-400">
        💡 Photo upload requires Firebase Storage to be enabled in your project
      </p>
    </div>
  );
}