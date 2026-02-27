/*
 * Design: "Clean Slate" -- Monochrome Workspace with Warm Accents
 * Threaded comments section for card detail panel (#2).
 * Each comment shows author avatar, name, team, timestamp, and text.
 */

import { useState } from "react";
import { TEAM_MEMBERS, type Comment } from "@/lib/data";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

interface CommentThreadProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export default function CommentThread({ comments, onAddComment }: CommentThreadProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " at " +
      d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="space-y-4">
      {/* Existing comments */}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment, i) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: i * 0.03 }}
              className="flex gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] font-medium">{comment.author.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-sm font-medium text-foreground">{comment.author.name}</span>
                  <span className="text-[9px] text-muted-foreground/50 uppercase tracking-wide">{comment.author.team}</span>
                  <span className="text-[10px] text-muted-foreground/40 ml-auto shrink-0">{formatTime(comment.timestamp)}</span>
                </div>
                {comment.section && (
                  <span className="text-[9px] text-accent uppercase tracking-wide font-medium">Re: {comment.section}</span>
                )}
                <p className="text-sm text-foreground/80 leading-relaxed">{comment.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground/40 italic py-2">No comments yet. Start the conversation.</p>
      )}

      {/* New comment input */}
      <div className="flex gap-2 pt-2 border-t border-border/60">
        <div className="w-7 h-7 rounded-full bg-foreground/80 text-background flex items-center justify-center shrink-0">
          <span className="text-[9px] font-medium">{TEAM_MEMBERS[0].initials}</span>
        </div>
        <div className="flex-1 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment... (Enter to send)"
            rows={2}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/40 resize-none pr-10"
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="absolute right-2 bottom-2 p-1.5 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <Send size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
