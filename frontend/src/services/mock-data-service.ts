import { startOfDay, subDays, format } from "date-fns"

export interface MetricData {
    date: Date
    label: string
    value: number
}

/**
 * 產生模擬指標數據
 * @param days 天數
 * @param min 最小值
 * @param max 最大值
 */
export const generateMockMetricData = (days: number, min: number, max: number): MetricData[] => {
    const data: MetricData[] = []
    const now = startOfDay(new Date())
    for (let i = days; i >= 0; i--) {
        const date = subDays(now, i)
        data.push({
            date,
            label: format(date, "MM/dd"),
            value: Math.floor(Math.random() * (max - min + 1)) + min
        })
    }
    return data
}
