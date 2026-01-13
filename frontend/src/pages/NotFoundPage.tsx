import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
            <h1 className="text-6xl font-serif font-bold">404</h1>
            <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
            <Button asChild>
                <Link to="/inbox">Go back to Inbox</Link>
            </Button>
        </div>
    )
}
