import type { MediaAsset } from "@/lib/types";
import { mediaSeed } from "@/lib/seed/media.seed";
import { getRepository } from "@/lib/repositories/get-repository";
import { generateId } from "./entity-service";

const repo = getRepository<MediaAsset>("media_assets", "media", mediaSeed);

export const mediaService = {
  getAll: repo.getAll,
  getById: repo.getById,
  remove: repo.remove,

  /**
   * Records a file reference (URL-based today). Once Supabase Storage
   * is connected, the upload API route (app/api/upload) should call
   * storage.from('media').upload(...) first, then this with the
   * returned public URL.
   */
  async record(input: Omit<MediaAsset, "id" | "createdAt">) {
    const asset: MediaAsset = { ...input, id: generateId("media"), createdAt: new Date().toISOString() };
    return repo.create(asset);
  },
};
