import { useParams } from "react-router-dom"

export default function ResourceEditorPage() {
    const { id } = useParams()
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-serif font-bold">Edit Resource: {id}</h1>
            <p className="text-muted-foreground">Markdown editor for your resource.</p>
        </div>
    )
}
