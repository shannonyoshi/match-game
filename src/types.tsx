import { SSL_OP_PKCS1_CHECK_1 } from "constants"


// except for ID, all categories should be 0, 1, or 2.
export interface Card {
  id: number;
  shape: number;
  count: number;
  shading: number;
  color: number;
}
export type CardKeys = "shape" | "count" | "shading" | "color"
export type Match = Card[]
