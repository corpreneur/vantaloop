/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Weekly Digest view (#5, #6, #7).
 * Shows AI-generated weekly summary, podcast player, and Slack notifications.
 */

import { MOCK_DIGEST, MOCK_SLACK_NOTIFICATIONS } from "@/lib/data";
import { Bot, Headphones, Hash, Clock, CheckCircle2, AlertTriangle, Plus, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function WeeklyDigestView() {
  const d = MOCK_DIGEST;
  const [playing, setPlaying] = useState(false);

  const formatDate = (ds: string) =>
    new Date(ds + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatTs = (ts: string) => {
    const dt = new Date(ts);
    return (
      dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " at " +
      dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h2 className="font-display text-2xl text-foreground mb-1">Weekly Digest</h2>
          <p className="text-sm text-muted-foreground">
            AI-generated summary for the week of {formatDate(d.weekOf)}.
          </p>
        </div>

        {/* AI Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border rounded-md p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
              <Bot size={14} className="text-accent" strokeWidth={1.5} />
            </div>
            <span className="label-meta text-foreground">AI Summary</span>
            <span className="text-[10px] text-muted-foreground/40 ml-auto">
              Generated {formatTs(d.generatedAt)}
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{d.summary}</p>
        </motion.div>

        {/* Podcast Player (#6) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-foreground text-background rounded-md p-5"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setPlaying(!playing);
                toast(playing ? "Paused." : "Playing podcast summary (simulated).");
              }}
              className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
            >
              {playing ? (
                <Pause size={16} className="text-background" strokeWidth={2} />
              ) : (
                <Play size={16} className="text-background ml-0.5" strokeWidth={2} />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Headphones size={13} strokeWidth={1.5} className="text-background/60" />
                <span className="text-xs font-medium text-background">Podcast Summary</span>
              </div>
              <p className="text-[11px] text-background/50">
                3:42 -- AI-generated audio briefing of this week's design feedback activity.
              </p>
              {/* Simulated waveform */}
              <div className="flex items-end gap-[2px] mt-2 h-4">
                {Array.from({ length: 48 }).map((_, i) => {
                  const h = Math.max(3, Math.sin(i * 0.4) * 12 + Math.random() * 6);
                  return (
                    <div
                      key={i}
                      className={`w-[3px] rounded-full transition-colors duration-300 ${
                        playing && i < 20 ? "bg-accent" : "bg-background/20"
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* New Concepts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-card border border-border rounded-md p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Plus size={13} strokeWidth={1.5} className="text-foreground" />
              <span className="label-meta text-foreground">New Concepts</span>
              <span className="text-[10px] text-muted-foreground/40 ml-auto">{d.newConcepts.length}</span>
            </div>
            <ul className="space-y-2">
              {d.newConcepts.map((c, i) => (
                <li key={i} className="text-sm text-foreground/80 leading-relaxed pl-3 border-l-2 border-accent/30">
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Decisions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-card border border-border rounded-md p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={13} strokeWidth={1.5} className="text-accent" />
              <span className="label-meta text-foreground">Decisions This Week</span>
              <span className="text-[10px] text-muted-foreground/40 ml-auto">{d.decisionsThisWeek.length}</span>
            </div>
            <ul className="space-y-2">
              {d.decisionsThisWeek.map((c, i) => (
                <li key={i} className="text-sm text-foreground/80 leading-relaxed pl-3 border-l-2 border-foreground/20">
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Open Items */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-card border border-border rounded-md p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock size={13} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="label-meta text-foreground">Open Items</span>
              <span className="text-[10px] text-muted-foreground/40 ml-auto">{d.openItems.length}</span>
            </div>
            <ul className="space-y-2">
              {d.openItems.map((c, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-3 border-l-2 border-border">
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Stale Items */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-card border border-border rounded-md p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={13} strokeWidth={1.5} className="text-destructive" />
              <span className="label-meta text-foreground">Stale Items</span>
              <span className="text-[10px] text-destructive ml-auto">{d.staleItems.length}</span>
            </div>
            <ul className="space-y-2">
              {d.staleItems.map((c, i) => (
                <li key={i} className="text-sm text-destructive/80 leading-relaxed pl-3 border-l-2 border-destructive/30">
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Slack Notifications (#7) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="bg-card border border-border rounded-md p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Hash size={13} strokeWidth={1.5} className="text-foreground" />
            <span className="label-meta text-foreground">Slack Notifications</span>
            <span className="text-[10px] text-muted-foreground/40">#{MOCK_SLACK_NOTIFICATIONS[0]?.channel.replace("#", "")}</span>
          </div>
          <div className="space-y-2">
            {MOCK_SLACK_NOTIFICATIONS.map((n, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${n.delivered ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                <span className="text-foreground/80 flex-1">{n.event}</span>
                <span className="text-[10px] text-muted-foreground/40 shrink-0">{formatTs(n.timestamp)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
