import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type PropertyInput, type PropertyResponse } from "@shared/routes";

// GET /api/properties
export function useProperties(filters?: { type?: string; category?: string; minPrice?: number; maxPrice?: number }) {
  // Construct query key based on filters to enable caching per filter set
  const queryKey = [api.properties.list.path, filters];

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build query string manually or use URLSearchParams
      const url = new URL(window.location.origin + api.properties.list.path);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch properties");
      return api.properties.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/properties/:id
export function useProperty(id: number) {
  return useQuery({
    queryKey: [api.properties.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.properties.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch property");
      return api.properties.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// POST /api/properties
export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PropertyInput) => {
      const validated = api.properties.create.input.parse(data);
      const res = await fetch(api.properties.create.path, {
        method: api.properties.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      const text = await res.text();
      let parsed: any = null;
      try { parsed = text ? JSON.parse(text) : null; } catch (e) {}
      if (!res.ok) {
        const msg = parsed?.message || res.statusText || `Request failed with status ${res.status}`;
        const err: any = new Error(msg);
        err.status = res.status;
        err.body = parsed;
        throw err;
      }
      const json = parsed ?? JSON.parse(text);
      return api.properties.create.responses[201].parse(json);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.properties.list.path] }),
  });
}

// PUT /api/properties/:id
export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<PropertyInput>) => {
      const validated = api.properties.update.input.parse(updates);
      const url = buildUrl(api.properties.update.path, { id });
      const res = await fetch(url, {
        method: api.properties.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      const text = await res.text();
      let parsed: any = null;
      try { parsed = text ? JSON.parse(text) : null; } catch (e) {}
      if (!res.ok) {
        const msg = parsed?.message || res.statusText || `Request failed with status ${res.status}`;
        const err: any = new Error(msg);
        err.status = res.status;
        err.body = parsed;
        throw err;
      }
      const json = parsed ?? JSON.parse(text);
      return api.properties.update.responses[200].parse(json);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.properties.list.path] }),
  });
}

// DELETE /api/properties/:id
export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.properties.delete.path, { id });
      const res = await fetch(url, { method: api.properties.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete property");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.properties.list.path] }),
  });
}
