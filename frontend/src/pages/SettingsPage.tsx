import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountSettings } from "@/components/settings/AccountSettings"
import { AppearanceSettings } from "@/components/settings/AppearanceSettings"
import { ShortcutList } from "@/components/settings/ShortcutList"
import { BillingSettings } from "@/components/settings/BillingSettings"
import { DataManagementSettings } from "@/components/settings/DataManagementSettings"

export default function SettingsPage() {
    return (
        <div className="container py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your account and customize your workspace.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-5 max-w-[700px]">
                    <TabsTrigger value="general">General & Account</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6 space-y-6">
                    <AccountSettings />
                </TabsContent>

                <TabsContent value="appearance" className="mt-6 space-y-6">
                    <AppearanceSettings />
                </TabsContent>

                <TabsContent value="shortcuts" className="mt-6 space-y-6">
                    <ShortcutList />
                </TabsContent>

                <TabsContent value="billing" className="mt-6 space-y-6">
                    <BillingSettings />
                </TabsContent>

                <TabsContent value="data" className="mt-6 space-y-6">
                    <DataManagementSettings />
                </TabsContent>
            </Tabs>
        </div>
    )
}
