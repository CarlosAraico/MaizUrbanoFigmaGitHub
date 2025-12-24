import { useState } from "react";
import { uploadImage } from "../api/upload";

export function ImageUploadField({ onChange }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handle(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    setLoading(true);
    try {
      const url = await uploadImage(f);
      setPreview(url);
      onChange?.(url);
    } catch (err) {
      setError(err.message || "Error al subir imagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handle} disabled={loading} />
      {preview && (
        <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded border" />
      )}
      {loading && <p className="text-sm text-[var(--color-text-muted)]">Subiendo...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
