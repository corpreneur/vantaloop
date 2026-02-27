/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Weekly Digest view -- fetches AI-generated summary from edge function.
 * Includes media upload with AI transcription.
 */

import { Bot, Hash, Clock, CheckCircle2, AlertTriangle, Plus, Loader2, RefreshCw, Upload, FileAudio, X, TrendingUp, Zap, Users, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DigestData {
  weekOf: string;
  generatedAt: string;
  summary: string;
  newConcepts: string[];
  decisionsThisWeek: string[];
  openItems: string[];
  staleItems: string[];
  themes?: string[];
  sentiment?: { overall: string; detail: string } | null;
  recommendedActions?: string[];
  teamDynamics?: string | null;
}

interface TranscriptData {
  transcript: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  questionsRaised?: string[];
}

export default function WeeklyDigestView() {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = useCallback(async (file: File) => {
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      toast.error("File too large. Maximum 20MB.");
      return;
    }

    const validTypes = ["audio/", "video/"];
    if (!validTypes.some((t) => file.type.startsWith(t))) {
      toast.error("Please upload an audio or video file.");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "mp3";
      const path = `transcriptions/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("feedback-attachments")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("feedback-attachments")
        .getPublicUrl(path);

      const { data, error } = await supabase.functions.invoke("transcribe-media", {
        body: { fileUrl: urlData.publicUrl },
      });
      if (error) throw error;
      setTranscriptData(data as TranscriptData);
      toast.success("Transcription complete!");
    } catch (err: any) {
      console.error("Upload/transcribe error:", err);
      toast.error("Failed to transcribe media.");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const formatDate = (ds: string) =>
    new Date(ds + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });

  const formatTs = (ts: string) => {
    const dt = new Date(ts);
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " at " + dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const sentimentColor: Record<string, string> = {
    positive: "text-accent",
    neutral: "text-muted-foreground",
    cautious: "text-[hsl(var(--chart-4))]",
    concerned: "text-destructive",
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
          <button onClick={fetchDigest} className="text-sm text-accent hover:text-foreground transition-colors">
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-card border border-border rounded-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
              <Bot size={14} className="text-accent" strokeWidth={1.5} />
            </div>
            <span className="label-meta text-foreground">AI Summary</span>
            <span className="text-[10px] text-muted-foreground/40 ml-auto">Generated {formatTs(digest.generatedAt)}</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{digest.summary}</p>
        </motion.div>

        {/* Themes & Sentiment Row */}
        {(digest.themes?.length || digest.sentiment) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {digest.themes && digest.themes.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 }} className="bg-card border border-border rounded-md p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={13} strokeWidth={1.5} className="text-accent" />
                  <span className="label-meta text-foreground">Key Themes</span>
                </div>
                <ul className="space-y-2">
                  {digest.themes.map((t, i) => (
                    <li key={i} className="text-sm text-foreground/80 leading-relaxed pl-3 border-l-2 border-accent/30">{t}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {digest.sentiment && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="bg-card border border-border rounded-md p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={13} strokeWidth={1.5} className="text-foreground" />
                  <span className="label-meta text-foreground">Team Sentiment</span>
                  <span className={`text-[10px] font-medium uppercase tracking-wide ml-auto ${sentimentColor[digest.sentiment.overall] || "text-muted-foreground"}`}>
                    {digest.sentiment.overall}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{digest.sentiment.detail}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Recommended Actions */}
        {digest.recommendedActions && digest.recommendedActions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.12 }} className="bg-accent/5 border border-accent/20 rounded-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={13} strokeWidth={1.5} className="text-accent" />
              <span className="label-meta text-foreground">Recommended Actions</span>
            </div>
            <ol className="space-y-2 list-decimal list-inside">
              {digest.recommendedActions.map((a, i) => (
                <li key={i} className="text-sm text-foreground/80 leading-relaxed">{a}</li>
              ))}
            </ol>
          </motion.div>
        )}

        {/* Team Dynamics */}
        {digest.teamDynamics && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.14 }} className="bg-card border border-border rounded-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users size={13} strokeWidth={1.5} className="text-foreground" />
              <span className="label-meta text-foreground">Team Dynamics</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{digest.teamDynamics}</p>
          </motion.div>
        )}

        {/* Media Upload / Transcription */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.16 }}>
          <div
            className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${dragOver ? "border-accent bg-accent/5" : "border-border"} ${uploading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = "";
              }}
            />
            {uploading ? (
              <div className="space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
                <p className="text-sm text-muted-foreground">Uploading and transcribing...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mx-auto">
                  <Upload size={16} className="text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-foreground">Drop audio or video here</p>
                <p className="text-xs text-muted-foreground">or click to browse • Max 20MB</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Transcript Results */}
        <AnimatePresence>
          {transcriptData && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="bg-card border border-border rounded-md p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileAudio size={13} strokeWidth={1.5} className="text-accent" />
                    <span className="label-meta text-foreground">Transcript Summary</span>
                  </div>
                  <button onClick={() => setTranscriptData(null)} className="p-1 text-muted-foreground hover:text-foreground">
                    <X size={12} />
                  </button>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">{transcriptData.summary}</p>

                {transcriptData.keyPoints.length > 0 && (
                  <div className="mb-4">
                    <p className="label-meta text-muted-foreground mb-2">Key Points</p>
                    <ul className="space-y-1.5">
                      {transcriptData.keyPoints.map((p, i) => (
                        <li key={i} className="text-sm text-foreground/80 pl-3 border-l-2 border-accent/30">{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {transcriptData.actionItems.length > 0 && (
                  <div className="mb-4">
                    <p className="label-meta text-muted-foreground mb-2">Action Items</p>
                    <ul className="space-y-1.5">
                      {transcriptData.actionItems.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                          <CheckCircle2 size={12} className="text-accent mt-1 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {transcriptData.questionsRaised && transcriptData.questionsRaised.length > 0 && (
                  <div>
                    <p className="label-meta text-muted-foreground mb-2">Questions Raised</p>
                    <ul className="space-y-1.5">
                      {transcriptData.questionsRaised.map((q, i) => (
                        <li key={i} className="text-sm text-muted-foreground pl-3 border-l-2 border-border">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Full Transcript (collapsible) */}
              <details className="bg-card border border-border rounded-md">
                <summary className="px-5 py-3 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  View full transcript
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">{transcriptData.transcript}</p>
                </div>
              </details>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* New Concepts */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="bg-card border border-border rounded-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <Plus size={13} strokeWidth={1.5} className="text-foreground" />
              <span className="label-meta text-foreground">New Concepts</span>
              <span className="text-[10px] text-muted-foreground/40 ml-auto">{digest.newConcepts.length}</span>
            </div>
            <ul className="space-y-2">
              {digest.newConcepts.map((c, i) => (
                <li key={i} className="text-sm text-foreground/80 leading-relaxed pl-3 border-l-2 border-accent/30">{c}</li>
              ))}
              {digest.newConcepts.length === 0 && <li className="text-sm text-muted-foreground/40 italic">None this week</li>}
            </ul>
          </motion.div>

          {/* Decisions */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }} className="bg-card border border-border rounded-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={13} strokeWidth={1.5} className="text-accent" />
              <span className="label-meta text-foreground">Decisions This Week</span>
              <span className="text-[10px] text-muted-foreground/40 ml-auto">{digest.decisionsThisWeek.length}</span>
            </div>
            <ul className="space-y-2">
              {digest.decisionsThisWeek.map((c, i) => (
                <li key={i} className="text-sm text-foreground/80 leading-relaxed pl-3 border-l-2 border-foreground/20">{c}</li>
              ))}
              {digest.decisionsThisWeek.length === 0 && <li className="text-sm text-muted-foreground/40 italic">None this week</li>}
            </ul>
          </motion.div>

          {/* Open Items */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} className="bg-card border border-border rounded-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={13} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="label-meta text-foreground">Open Items</span>
              <span className="text-[10px] text-muted-foreground/40 ml-auto">{digest.openItems.length}</span>
            </div>
            <ul className="space-y-2">
              {digest.openItems.map((c, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-3 border-l-2 border-border">{c}</li>
              ))}
              {digest.openItems.length === 0 && <li className="text-sm text-muted-foreground/40 italic">All clear</li>}
            </ul>
          </motion.div>

          {/* Stale Items */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.35 }} className="bg-card border border-border rounded-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={13} strokeWidth={1.5} className="text-destructive" />
              <span className="label-meta text-foreground">Stale Items</span>
              <span className="text-[10px] text-destructive ml-auto">{digest.staleItems.length}</span>
            </div>
            <ul className="space-y-2">
              {digest.staleItems.map((c, i) => (
                <li key={i} className="text-sm text-destructive/80 leading-relaxed pl-3 border-l-2 border-destructive/30">{c}</li>
              ))}
              {digest.staleItems.length === 0 && <li className="text-sm text-muted-foreground/40 italic">No stale items</li>}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
