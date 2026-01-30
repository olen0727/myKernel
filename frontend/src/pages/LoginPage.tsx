import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/providers/AuthProvider"
import { Github, Mail } from "lucide-react"
import { Navigate } from "react-router-dom"

export default function LoginPage() {
    const { user, isLoading, loginWithGoogle, loginWithGitHub } = useAuth()

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-background">Loading...</div>
    }

    if (user) {
        return <Navigate to="/dashboard" replace />
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Kernel</CardTitle>
                    <CardDescription>
                        Sign in to continue to your second brain.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button variant="outline" className="w-full" onClick={loginWithGoogle}>
                        <Mail className="mr-2 h-4 w-4" />
                        Continue with Google
                    </Button>
                    <Button variant="outline" className="w-full" onClick={loginWithGitHub}>
                        <Github className="mr-2 h-4 w-4" />
                        Continue with GitHub
                    </Button>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our Terms of Service and Privacy Policy.
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
