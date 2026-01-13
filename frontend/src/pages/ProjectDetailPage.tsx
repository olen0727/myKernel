import { useParams } from "react-router-dom"

export default function ProjectDetailPage() {
    const { id } = useParams()
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-serif font-bold">Project: {id}</h1>
            <p className="text-muted-foreground">Project details and task management.</p>
        </div>
    )
}
