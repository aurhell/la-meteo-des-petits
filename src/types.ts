import type { FRIENDS } from "./constants"

export type Friend = (typeof FRIENDS)[keyof typeof FRIENDS]
