"use client";

type ApprovalPendingNoticeProps = {
    className?: string;
};

export default function ApprovalPendingNotice({ className = "" }: ApprovalPendingNoticeProps) {
    return (
        <div className={`flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-800 ${className}`.trim()}>
            <span className="relative flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
            </span>
            <span className="animate-pulse">Warte auf Freigabe durch das Assistenzsystem.</span>
        </div>
    );
}
