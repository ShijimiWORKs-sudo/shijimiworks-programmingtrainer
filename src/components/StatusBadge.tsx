interface StatusBadgeProps {
  status: "available" | "planned" | "draft" | "published";
}

const labels: Record<StatusBadgeProps["status"], string> = {
  available: "Available",
  planned: "Coming soon",
  draft: "Draft",
  published: "Published",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={"status-badge status-" + status}>{labels[status]}</span>;
}
