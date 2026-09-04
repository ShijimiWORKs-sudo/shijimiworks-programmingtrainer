interface StatusBadgeProps {
  status: "available" | "planned" | "draft" | "published" | "passed" | "in_progress" | "not_started" | "paused" | "submitted";
}

const labels: Record<StatusBadgeProps["status"], string> = {
  available: "Available",
  planned: "Coming soon",
  draft: "Draft",
  published: "Ready",
  passed: "Passed",
  in_progress: "In progress",
  not_started: "Not started",
  paused: "Paused",
  submitted: "Submitted",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={"status-badge status-" + status}>{labels[status]}</span>;
}
