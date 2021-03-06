import { SSL_OP_PKCS1_CHECK_1 } from "constants"


// except for ID, all categories should be 0, 1, or 2.
export interface CardInter {
  id: number;
  shape: number;
  count: number;
  shading: number;
  color: number;
}
export type Match = CardInter[]

export type ThemeOpts = "default" | "dark" | "mono" | "mono-dark"
