import { useParams } from "react-router-dom"

export default function JournalPage() {
    const { date } = useParams()
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-serif font-bold">Journal: {date || "Today"}</h1>
            <p className="text-muted-foreground">Daily reflection and habit tracking.</p>
        </div>
    )
}
