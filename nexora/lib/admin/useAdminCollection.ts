"use client";

import { useCallback, useEffect, useState } from "react";
import type { PublishStatus } from "@/lib/types";

type WithId = { id: string };
type WithStatus = WithId & { status: PublishStatus };

interface EntityService<T extends WithStatus> {
  getAll: () => Promise<T[]>;
  create: (item: T) => Promise<T>;
  update: (id: string, patch: Partial<T>) => Promise<T | null>;
  remove: (id: string) => Promise<void>;
  publish: (id: string) => Promise<T | null>;
  unpublish: (id: string) => Promise<T | null>;
}

/**
 * Every Admin CMS list page uses this hook against its entity service.
 * It's the one place list/create/edit/delete/publish state lives, so no
 * module reimplements loading or error handling from scratch.
 */
export function useAdminCollection<T extends WithStatus>(service: EntityService<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setItems(data);
    } catch {
      setError("Couldn't load this data. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createItem(item: T) {
    await service.create(item);
    await refresh();
  }

  async function updateItem(id: string, patch: Partial<T>) {
    await service.update(id, patch);
    await refresh();
  }

  async function removeItem(id: string) {
    await service.remove(id);
    await refresh();
  }

  async function togglePublish(item: T) {
    if (item.status === "published") {
      await service.unpublish(item.id);
    } else {
      await service.publish(item.id);
    }
    await refresh();
  }

  return { items, loading, error, refresh, createItem, updateItem, removeItem, togglePublish };
}
