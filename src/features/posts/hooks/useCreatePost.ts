import { useMutation } from "@tanstack/react-query";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuthStore } from "../../auth/auth.store";

export function useCreatePost() {
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (content: string) => {
      console.log("user:", user);
      console.log("db:", db);
      if (!user) throw new Error("Not logged in");
      const result = await addDoc(collection(db, "posts"), {
        userId: user.id,
        author: user.name,
        content: content.trim(),
        likes: 0,
        likedBy: [],
        comments: [],
        createdAt: serverTimestamp(),
      });
      console.log("Post created:", result.id);
    },
    onError: (err) => {
      console.error("Create post error:", err);
    },
  });
}