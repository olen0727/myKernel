import { useParams } from "react-router-dom"

export default function AreaDetailPage() {
    const { id } = useParams()
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-serif font-bold">Area: {id}</h1>
            <p className="text-muted-foreground">Area overview and linked content.</p>
        </div>
    )
}
