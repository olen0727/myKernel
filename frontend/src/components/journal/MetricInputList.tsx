import React, { useMemo, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { MetricItem } from './MetricItem'
import { cn } from '@/lib/utils'
import { SleepTracker } from './SleepTracker'
import { services, MetricService, LogService } from '@/services'
import { useObservable } from '@/hooks/use-observable'
import { Metric, Log } from '@/types/models'

interface MetricInputListProps {
    date: Date
    readOnly?: boolean
    className?: string
}

export const MetricInputList: React.FC<MetricInputListProps> = ({ date, readOnly, className }) => {
    const [metricService, setMetricService] = useState<MetricService | undefined>();
    const [logService, setLogService] = useState<LogService | undefined>();

    useEffect(() => {
        const load = async () => {
            setMetricService(await services.metric);
            setLogService(await services.log);
        };
        load();
    }, []);

    const dateStr = format(date, 'yyyy-MM-dd')

    const definitions$ = useMemo(() => metricService?.getAll$(), [metricService]);
    const definitions = useObservable<Metric[]>(definitions$, []) || [];

    const allLogs$ = useMemo(() => logService?.getAll$(), [logService]);
    const allLogs = useObservable<Log[]>(allLogs$, []) || [];

    const entries = useMemo(() => {
        return allLogs.filter(l => l.date === dateStr && l.metricId);
    }, [allLogs, dateStr]);

    const handleMetricChange = async (metricId: string, value: number | undefined, metadata?: Record<string, any>) => {
        if (!logService) return;

        // Find existing entry
        const existing = entries.find(e => e.metricId === metricId);

        if (value === undefined || value === null) {
            if (existing) {
                await logService.delete(existing.id);
            }
        } else {
            const data: any = {
                date: dateStr,
                action: 'metric_entry',
                metricId: metricId,
                value: String(value),
            };
            if (metadata) {
                data.details = JSON.stringify(metadata);
            }

            if (existing) {
                await logService.update(existing.id, data);
            } else {
                await logService.create(data);
            }
        }
    }

    if (!metricService || !logService) return <div>Loading Metrics...</div>;

    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4", className)}>
            {definitions.map(def => {
                const entry = entries.find(e => e.metricId === def.id)
                const metricValue = entry?.value ? Number(entry.value) : undefined;
                let metadata: any = undefined;
                try {
                    metadata = entry?.details ? JSON.parse(entry.details) : undefined;
                } catch (e) { }

                if (def.type === 'sleep' || def.id === 'sleep') {
                    return (
                        <SleepTracker
                            key={def.id}
                            date={date}
                            readOnly={readOnly}
                            initialSleepTime={metadata?.sleepTime}
                            initialWakeTime={metadata?.wakeTime}
                            title={def.name}
                            onDataChange={(durationMinutes, sleepTime, wakeTime) => {
                                if (durationMinutes === undefined) {
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
                        definition={def as any}
                        value={metricValue}
                        onChange={(val) => handleMetricChange(def.id, val)}
                        readOnly={readOnly}
                    />
                )
            })}
        </div>
    )
}
