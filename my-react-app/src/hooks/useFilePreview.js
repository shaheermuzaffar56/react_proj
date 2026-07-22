// src/hooks/useFilePreview.js
// Moved from features/auth/hooks — now shared with features/tweets (TweetForm image upload).
import { useEffect, useState } from "react";

// Turns a FileList (from a react-hook-form-registered <input type="file">) into
// an object URL for previewing, revoking the previous URL whenever the file changes
// or the component unmounts, to avoid leaking blob URLs.
export function useFilePreview(fileList) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const file = fileList?.[0];
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [fileList]);

  return url;
}