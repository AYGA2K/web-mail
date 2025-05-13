import type { Email } from "../entities/mail.entity.js";
import type { Condition } from "./sql-condition.js";
import type { SortOption } from "./sql-sort-option.js";

export type FindOptions = {
  conditions?: Condition[];
  limit?: number;
  offset?: number;
  orderBy?: SortOption[];
  groupBy?: (keyof Email)[];

};
