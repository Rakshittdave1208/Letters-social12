import {useState} from "react";
import Card from "../../../components/ui/Card";

type Props={
  onCreate:(content:string)=>void
};

export default function CreatePost({onCreate}:Props){
  const[text,setText]=useState("");
   function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim()) return;

    onCreate(text);
    setText("");
}
return(
  <Card>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a letter..."
          className="w-full border rounded-lg p-3 resize-none focus:outline-none"
          rows={3}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
          >
            Post
          </button>
        </div>
      </form>
    </Card>
);
}