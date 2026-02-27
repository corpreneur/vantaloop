/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Weekly Digest view -- fetches AI-generated summary from edge function.
 */

import { Bot, Headphones, Hash, Clock, CheckCircle2, AlertTriangle, Plus, Play, Pause, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "../../../src/integrations/supabase/client";

interface DigestData {
  weekOf: string;
  generatedAt: string;
  summary: string;
  newConcepts: string[];
  decisionsThisWeek: string[];
  openItems: string[];
  staleItems: string[];
}

export default function WeeklyDigestView() {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  const fetchDigest = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("weekly-digest");
      if (error) throw error;
      setDigest(data as DigestData);
    } catch (err: any) {
      console.error("Digest fetch error:", err);
      toast.error("Failed to generate digest.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDigest();
  }, [fetchDigest]);

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

  if (loading && !digest) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Generating weekly digest...</p>
        </div>
      </div>
    );
  }

  if (!digest) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Bot className="w-10 h-10 text-muted-foreground/20 mx-auto" />
          <p className="text-sm text-muted-foreground">No digest available.</p>
          <button
            onClick={fetchDigest}
            className="text-sm text-accent hover:text-foreground transition-colors"
          >
            Generate now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl text-foreground mb-1">Weekly Digest</h2>
            <p className="text-sm text-muted-foreground">
              AI-generated summary for the week of {formatDate(digest.weekOf)}.
            </p>
          </div>
          <button
            onClick={fetchDigest}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Regenerate
          </button>
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
              Generated {formatTs(digest.generatedAt)}
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{digest.summary}</p>
        </motion.div>

        {/* Podcast Player */}
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
              <span className="text-[10px] text-muted-foreground/40 ml-auto">{digest.newConcepts.length}</span>
            </div>
            <ul className="space-y-2">
              {digest.newConcepts.map((c, i) => (
                <li key={i} className="text-sm text-foreground/80 leading-relaxed pl-3 border-l-2 border-accent/30">
                  {c}
                </li>
              ))}
              {digest.newConcepts.length === 0 && (
                <li className="text-sm text-muted-foreground/40 italic">None this week</li>
              )}
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
              <span className="text-[10px] text-muted-foreground/40 ml-auto">{digest.decisionsThisWeek.length}</span>
            </div>
            <ul className="space-y-2">
              {digest.decisionsThisWeek.map((c, i) => (
                <li key={i} className="text-sm text-foreground/80 leading-relaxed pl-3 border-l-2 border-foreground/20">
                  {c}
                </li>
              ))}
              {digest.decisionsThisWeek.length === 0 && (
                <li className="text-sm text-muted-foreground/40 italic">None this week</li>
              )}
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
              <span className="text-[10px] text-muted-foreground/40 ml-auto">{digest.openItems.length}</span>
            </div>
            <ul className="space-y-2">
              {digest.openItems.map((c, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-3 border-l-2 border-border">
                  {c}
                </li>
              ))}
              {digest.openItems.length === 0 && (
                <li className="text-sm text-muted-foreground/40 italic">All clear</li>
              )}
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
              <span className="text-[10px] text-destructive ml-auto">{digest.staleItems.length}</span>
            </div>
            <ul className="space-y-2">
              {digest.staleItems.map((c, i) => (
                <li key={i} className="text-sm text-destructive/80 leading-relaxed pl-3 border-l-2 border-destructive/30">
                  {c}
                </li>
              ))}
              {digest.staleItems.length === 0 && (
                <li className="text-sm text-muted-foreground/40 italic">No stale items</li>
              )}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
