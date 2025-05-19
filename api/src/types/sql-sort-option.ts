import type { Email } from "../entities/mail.entity.js";

export type SortOption = {
  column: keyof Email;
  direction: "asc" | "desc";
};
