import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AppearanceSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label className="text-base">Theme</Label>
                    <div className="flex gap-4" role="radiogroup" aria-label="Theme selection">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="theme"
                                value="dark"
                                defaultChecked
                                className="accent-primary h-4 w-4"
                            />
                            <span className="text-sm">Kernel Dark</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="theme"
                                value="light"
                                className="accent-primary h-4 w-4"
                            />
                            <span className="text-sm">Kernel Light</span>
                        </label>
                    </div>
                </div>

                <div className="grid gap-2 max-w-sm">
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select defaultValue="inter">
                        <SelectTrigger id="font-family">
                            <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="noto-sans-tc">Noto Sans TC</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}
