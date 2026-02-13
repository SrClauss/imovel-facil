import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { InsertContact } from "@shared/schema";

export function useCreateContact() {
  return useMutation({
    mutationFn: async (data: InsertContact) => {
      const validated = api.contacts.create.input.parse(data);
      const res = await fetch(api.contacts.create.path, {
        method: api.contacts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.contacts.create.responses[201].parse(await res.json());
    },
  });
}
