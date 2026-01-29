import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function BillingSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription plan and payment details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Current Plan</p>
                        <p className="text-2xl font-bold">Free</p>
                    </div>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        Free
                    </span>
                </div>

                <Button className="w-full" variant="outline">
                    Upgrade to Pro
                </Button>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground">No payment method on file.</p>
                </div>
            </CardContent>
        </Card>
    )
}
