import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { dataStore, MetricDefinition, MetricEntry } from '@/services/mock-data-service'
import { MetricItem } from './MetricItem'
import { cn } from '@/lib/utils'
import { SleepTracker } from './SleepTracker'

interface MetricInputListProps {
    date: Date
    readOnly?: boolean
    className?: string
}

export const MetricInputList: React.FC<MetricInputListProps> = ({ date, readOnly, className }) => {
    const [definitions, setDefinitions] = useState<MetricDefinition[]>([])
    const [entries, setEntries] = useState<MetricEntry[]>([])
    const dateStr = format(date, 'yyyy-MM-dd')

    useEffect(() => {
        setDefinitions(dataStore.getMetricDefinitions())
        setEntries(dataStore.getMetricEntries(dateStr))
    }, [dateStr])

    const handleMetricChange = (metricId: string, value: number | undefined, metadata?: Record<string, any>) => {
        if (value === undefined || value === null) {
            dataStore.deleteMetricEntry(dateStr, metricId)
        } else {
            dataStore.saveMetricEntry(dateStr, metricId, value, metadata)
        }
        setEntries(dataStore.getMetricEntries(dateStr)) // Refresh
    }

    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4", className)}>
            {definitions.map(def => {
                const entry = entries.find(e => e.metricId === def.id)

                if (def.id === 'sleep') {
                    return (
                        <SleepTracker
                            key={def.id}
                            date={date}
                            readOnly={readOnly}
                            initialSleepTime={entry?.metadata?.sleepTime}
                            initialWakeTime={entry?.metadata?.wakeTime}
                            title={def.name}
                            onDataChange={(durationMinutes, sleepTime, wakeTime) => {
                                if (durationMinutes === undefined) {
                                    // Clear data
                                    handleMetricChange(def.id, undefined)
                                } else {
                                    handleMetricChange(def.id, Number((durationMinutes / 60).toFixed(2)), { sleepTime, wakeTime })
                                }
                            }}
                        />
                    )
                }

                return (
                    <MetricItem
                        key={def.id}
                        definition={def}
                        value={entry?.value}
                        onChange={(val) => handleMetricChange(def.id, val)}
                        readOnly={readOnly}
                    />
                )
            })}
        </div>
    )
}
