// src/constants/tweetStatus.js
// Status → label/MUI-Chip-color map, sourced from the Figma export's
// components/ui/Badges.tsx statusConfig (draft/awaiting_approval/published/rejected/archived).
export const STATUS_CHIP_MAP = {
  draft: { label: "Draft", color: "default" },
  awaiting_approval: { label: "Awaiting Approval", color: "warning" },
  approved: { label: "Approved", color: "success" },
  published: { label: "Published", color: "success" },
  rejected: { label: "Rejected", color: "error" },
  archived: { label: "Archived", color: "primary" },
};

// Falls back gracefully for any status not in the map above.
export function getStatusChipProps(status) {
  return STATUS_CHIP_MAP[status] ?? { label: status, color: "default" };
}