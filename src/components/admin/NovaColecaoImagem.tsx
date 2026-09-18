"use client";

import { useState } from "react";
import { ImagemUpload } from "@/components/admin/ImagemUpload";

export function NovaColecaoImagem() {
  const [imagemUrl, setImagemUrl] = useState("");

  return (
    <div className="w-[100px] shrink-0">
      <ImagemUpload label="Imagem" value={imagemUrl} onChange={setImagemUrl} />
      <input type="hidden" name="imagemUrl" value={imagemUrl} />
    </div>
  );
}
