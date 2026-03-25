export const ACCESS_LEVELS = {
  PUBLIC: 0,
  STAFF: 50,
  MANAGEMENT: 80,
  ADMIN: 100,
} as const;

export type AccessLevel = typeof ACCESS_LEVELS[keyof typeof ACCESS_LEVELS];