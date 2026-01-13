import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-serif font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 max-w-[400px]">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Theme</TabsTrigger>
                    <TabsTrigger value="notifications">Alerts</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>Configure basic application behavior.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="h-40 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                                Preferences Placeholder
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="appearance" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize how Kernel looks on your screen.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">You can also use the theme toggle in the top bar.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
