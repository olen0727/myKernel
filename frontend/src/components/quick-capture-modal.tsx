import React, { useEffect, useRef, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useQuickCapture } from "@/stores/quick-capture-store"
import { toast } from "sonner"
import { Sparkles, Command, CornerDownLeft, Loader2, Link as LinkIcon, FileText } from "lucide-react"
import { parseContent, ParsedContent } from "@/lib/content-parser"

export const QuickCaptureModal: React.FC = () => {
    const { isOpen, onClose, content, setContent } = useQuickCapture()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [parsedPreview, setParsedPreview] = useState<ParsedContent | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Auto-focus when modal opens
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                textareaRef.current?.focus()
            }, 50)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    // Live Parse Preview
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (content.trim()) {
                const result = await parseContent(content)
                setParsedPreview(result)
            } else {
                setParsedPreview(null)
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [content])

    const handleSubmit = async () => {
        if (!content.trim()) return
        setIsSubmitting(true)

        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 800))

        const finalData = parsedPreview || await parseContent(content)

        console.log("Quick captured to Inbox:", finalData)
        toast.success("已儲存至 Inbox", {
            description: finalData.url ? `已儲存連結: ${finalData.title}` : "已儲存筆記",
            icon: <Sparkles className="w-4 h-4 text-primary" />
        })

        setIsSubmitting(false)
        setContent("") // Clear after successful save
        setParsedPreview(null)
        onClose()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleSubmit()
        }
        if (e.key === "Escape") {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl bg-popover/95 backdrop-blur-xl">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-black flex items-center gap-2 tracking-tight">
                        <span className="bg-primary/20 text-primary p-1.5 rounded-lg">✨</span>
                        快速捕捉 Quick Capture
                    </DialogTitle>
                    <DialogDescription className="text-xs font-medium text-muted-foreground uppercase tracking-widest pt-1">
                        隨手記下你的靈感、任務或筆記
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4">
                    <Textarea
                        ref={textareaRef}
                        placeholder="在此輸入想法... (Ctrl+Enter 儲存)"
                        className="min-h-[140px] text-lg font-medium bg-transparent border-none focus-visible:ring-0 resize-none p-0 placeholder:text-muted-foreground/40 leading-relaxed"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSubmitting}
                    />

                    {/* Smart Parse Preview Area */}
                    {parsedPreview && (
                        <div className="mt-4 p-3 bg-muted/40 rounded-xl border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-background rounded-lg shadow-sm shrink-0">
                                    {parsedPreview.url ? (
                                        <LinkIcon className="w-4 h-4 text-blue-500" />
                                    ) : (
                                        <FileText className="w-4 h-4 text-orange-500" />
                                    )}
                                </div>
                                <div className="space-y-1 min-w-0">
                                    <h4 className="text-sm font-bold truncate">{parsedPreview.title}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{parsedPreview.description}</p>
                                    {parsedPreview.url && (
                                        <div className="text-[10px] bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded inline-block font-medium mt-1">
                                            Smart Link Detect
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-t border-border/50">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <span className="p-1 rounded bg-muted-foreground/10 flex items-center h-4 w-4 justify-center">
                                <Command className="w-2.5 h-2.5" />
                            </span>
                            <span>+</span>
                            <span className="p-1 rounded bg-muted-foreground/10 flex items-center h-4 w-4 justify-center">
                                <CornerDownLeft className="w-2.5 h-2.5" />
                            </span>
                            <span>儲存</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="px-1 py-0.5 rounded bg-muted-foreground/10">ESC</span>
                            <span>取消</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!content.trim() || isSubmitting}
                        className="rounded-xl px-6 font-black shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "儲存"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
