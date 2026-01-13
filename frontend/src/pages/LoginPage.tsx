export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-6">
            <div className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-8 shadow-lg">
                <h1 className="text-2xl font-serif font-bold text-center">Login to Kernel</h1>
                <p className="text-sm text-muted-foreground text-center">Welcome back.</p>
                {/* Future: OAuth Buttons */}
            </div>
        </div>
    )
}
