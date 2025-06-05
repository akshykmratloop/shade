import { useState } from "react";
import { Upload } from "lucide-react";
import { Img_url } from "../../routes/backend"; // your base image URL

const DirectInputFile = ({
  label,
  baseClass,
  id,
  currentPath,
  contentIndex,
  index,
  subSection,
  section,
  directIcon,
  order,
  url,
  disabled = false,
}) => {
  const [fileURL, setFileURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: Preview immediately
    const localUrl = URL.createObjectURL(file);
    setFileURL(localUrl);

    // Create form data
    const formData = new FormData();
    formData.append("file", file); // backend expects 'file' as key, adjust if needed
    formData.append("section", section || "");
    formData.append("index", index ?? "");

    try {
      setIsUploading(true);

      const response = await fetch("https://your-backend/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Upload success:", data);

      // Optional: Use `data.url` to update the preview
      // setFileURL(data.url);

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${baseClass} mt-2 flex flex-col`}>
      <label htmlFor={id} className="label-text sm:text-xs xl:text-sm mb-1 text-[#6B7888]">
        {label}
      </label>

      <div className="relative w-40 h-40">
        <div
          className={`w-40 h-40 border border-[#80808044] rounded-full overflow-hidden ${disabled || isUploading ? "cursor-not-allowed" : "cursor-pointer"} bg-white dark:bg-[#2a303c]`}
        >
          {(url || fileURL) ? (
            <img
              src={
                fileURL || ((url && url.slice(0, 5) !== "https") ? `${Img_url}${url}` : "")
              }
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              <Upload className="w-6 h-6" />
            </div>
          )}
        </div>

        {!disabled && !isUploading && (
          <input
            type="file"
            accept="image/*"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleImageSelect}
          />
        )}

        {(disabled || isUploading) && (
          <div className="absolute inset-0 bg-transparent z-[20] rounded-full " />
        )}
      </div>
    </div>
  );
};

export default DirectInputFile;
