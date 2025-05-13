import type { Email } from "../entities/mail.entity.js";

export type Condition = {
  column: keyof Email;
  operator: '=' | '!=' | '<' | '<=' | '>' | '>=' | 'like' | 'in'; // extend as needed
  value: any;
};
