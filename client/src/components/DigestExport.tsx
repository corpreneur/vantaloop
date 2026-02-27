import { useState, useMemo } from "react";
import { Copy, Download, Check, Users, Tag, Clock } from "lucide-react";
import { toast } from "sonner";

type IntakeItem = {
  id: string;
  title: string;
  body: string | null;
  submitter_name: string | null;
  source: string;
  status: string;
  feedback_type: string | null;
  goal_of_share: string | null;
  whats_working: string | null;
  questions_risks: string | null;
  suggestions: string | null;
  decision_needed: string | null;
  created_at: string;
};

type GroupMode = "submitter" | "type" | "chronological";

const TYPE_LABELS: Record<string, string> = {
  "concept-direction": "Concept Direction",
  "information-architecture": "Information Architecture",
  "interaction-pattern": "Interaction Pattern",
  "visual-design": "Visual Design",
  "copy-content": "Copy / Content",
  general: "General",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCurrentWeekLabel() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(monday)} – ${fmt(friday)}, ${now.getFullYear()}`;
}

function buildSection(label: string, value: string | null): string {
  if (!value?.trim()) return "";
  return `  - ${label}: ${value.trim()}`;
}

function formatItemMarkdown(item: IntakeItem, includeSubmitter = false): string {
  const lines: string[] = [];
  const prefix = includeSubmitter && item.submitter_name
    ? `**${item.title}** _(${item.submitter_name})_`
    : `**${item.title}**`;
  lines.push(`- ${prefix}`);

  const sections = [
    buildSection("Goal", item.goal_of_share),
    buildSection("Working", item.whats_working),
    buildSection("Risks/Questions", item.questions_risks),
    buildSection("Suggestions", item.suggestions),
    buildSection("Decision Needed", item.decision_needed),
  ].filter(Boolean);

  if (sections.length > 0) {
    lines.push(...sections);
  } else if (item.body?.trim()) {
    lines.push(`  - ${item.body.trim()}`);
  }

  return lines.join("\n");
}

function generateDigest(items: IntakeItem[], groupMode: GroupMode): string {
  const weekLabel = getCurrentWeekLabel();
  const lines: string[] = [
    `# Weekly Intake Digest`,
    `**${weekLabel}** · ${items.length} items\n`,
  ];

  if (items.length === 0) {
    lines.push("_No intake items this week._");
    return lines.join("\n");
  }

  if (groupMode === "submitter") {
    const groups = new Map<string, IntakeItem[]>();
    items.forEach((item) => {
      const key = item.submitter_name || "Anonymous";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    });
    groups.forEach((groupItems, name) => {
      lines.push(`## ${name}`);
      groupItems.forEach((item) => {
        lines.push(formatItemMarkdown(item, false));
      });
      lines.push("");
    });
  } else if (groupMode === "type") {
    const groups = new Map<string, IntakeItem[]>();
    items.forEach((item) => {
      const key = item.feedback_type || "general";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    });
    groups.forEach((groupItems, type) => {
      lines.push(`## ${TYPE_LABELS[type] || type}`);
      groupItems.forEach((item) => {
        lines.push(formatItemMarkdown(item, true));
      });
      lines.push("");
    });
  } else {
    items.forEach((item) => {
      lines.push(
        `### ${formatDate(item.created_at)}`
      );
      lines.push(formatItemMarkdown(item, true));
      lines.push("");
    });
  }

  // Questions section
  const withQuestions = items.filter((i) => i.questions_risks?.trim());
  if (withQuestions.length > 0) {
    lines.push(`---\n## ❓ Questions`);
    withQuestions.forEach((item) => {
      lines.push(`- ${item.submitter_name || "Anonymous"}: ${item.questions_risks!.trim()}`);
    });
    lines.push("");
  }

  // Suggestions section
  const withSuggestions = items.filter((i) => i.suggestions?.trim());
  if (withSuggestions.length > 0) {
    lines.push(`## 💡 Suggested Feedback`);
    withSuggestions.forEach((item) => {
      lines.push(`- ${item.suggestions!.trim()}`);
    });
    lines.push("");
  }

  return lines.join("\n");
}

const GROUP_MODES: { id: GroupMode; label: string; icon: React.ReactNode }[] = [
  { id: "submitter", label: "By person", icon: <Users size={13} /> },
  { id: "type", label: "By type", icon: <Tag size={13} /> },
  { id: "chronological", label: "Timeline", icon: <Clock size={13} /> },
];

export default function DigestExport({ items }: { items: IntakeItem[] }) {
  const [groupMode, setGroupMode] = useState<GroupMode>("submitter");
  const [copied, setCopied] = useState(false);

  const digest = useMemo(() => generateDigest(items, groupMode), [items, groupMode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(digest);
      setCopied(true);
      toast.success("Digest copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy.");
    }
  };

  const handleDownloadPdf = () => {
    // Use browser print to PDF — clean and dependency-free
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to download PDF.");
      return;
    }

    const htmlContent = digestToHtml(digest);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Weekly Intake Digest</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; padding: 40px 48px; color: #1a1a1a; line-height: 1.6; max-width: 800px; }
          h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
          h2 { font-size: 16px; font-weight: 600; margin-top: 24px; margin-bottom: 8px; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; }
          h3 { font-size: 13px; font-weight: 500; color: #666; margin-top: 16px; margin-bottom: 4px; }
          p { font-size: 13px; margin-bottom: 8px; color: #444; }
          ul { padding-left: 20px; margin-bottom: 12px; }
          li { font-size: 13px; margin-bottom: 6px; }
          li ul { margin-top: 4px; }
          strong { font-weight: 600; }
          em { font-style: italic; color: #666; }
          hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>${htmlContent}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  return (
    <div className="space-y-4">
      {/* Group toggle */}
      <div className="flex items-center gap-2">
        {GROUP_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setGroupMode(mode.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-colors ${
              groupMode === mode.id
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/20"
            }`}
          >
            {mode.icon}
            {mode.label}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="bg-card border border-border rounded-md p-4 max-h-[50vh] overflow-y-auto">
        <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
          {digest}
        </pre>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy to clipboard"}
        </button>
        <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download size={13} />
          Download PDF
        </button>
      </div>
    </div>
  );
}

/** Simple markdown → HTML converter for the print view */
function digestToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/^---$/gm, "<hr>")
    .replace(/^  - (.+)$/gm, "<li style='margin-left:20px;font-size:12px;color:#555'>$1</li>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n{2,}/g, "\n")
    .split("\n")
    .map((line) => {
      if (line.startsWith("<h") || line.startsWith("<li") || line.startsWith("<hr")) return line;
      if (line.trim()) return `<p>${line}</p>`;
      return "";
    })
    .join("\n");
}
