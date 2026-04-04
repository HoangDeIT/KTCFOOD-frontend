export const MaterialImportReason = {
    Purchased: 0,
    BatchCanceled: 1,
    InventoryAdjustment: 2
} as const;

export type MaterialImportReason =
    (typeof MaterialImportReason)[keyof typeof MaterialImportReason];