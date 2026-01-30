import { renderHook, act } from '@testing-library/react';
import { BehaviorSubject, Subject } from 'rxjs';
import { useObservable } from '../use-observable';
import { describe, it, expect } from 'vitest';

describe('useObservable', () => {
    it('should return initial value if provided', () => {
        const subject = new BehaviorSubject(1);
        const { result } = renderHook(() => useObservable(subject, 0));
        // BehaviorSubject emits immediately upon subscription
        expect(result.current).toBe(1);
    });

    it('should update value when observable emits', async () => {
        const subject = new Subject<number>();
        const { result } = renderHook(() => useObservable(subject, 0));

        expect(result.current).toBe(0);

        act(() => {
            subject.next(1);
        });

        expect(result.current).toBe(1);
    });

    it('should handle undefined initial value', () => {
        const subject = new Subject<number>();
        const { result } = renderHook(() => useObservable(subject));

        expect(result.current).toBeUndefined();

        act(() => {
            subject.next(1);
        });

        expect(result.current).toBe(1);
    });

    it('should clean up subscription on unmount', () => {
        const subject = new Subject<number>();
        let observerCount = 0;

        // Mock subscribe to count observers
        const originalSubscribe = subject.subscribe.bind(subject);
        subject.subscribe = (...args: any[]) => {
            observerCount++;
            const sub = originalSubscribe(...args);
            const originalUnsubscribe = sub.unsubscribe.bind(sub);
            sub.unsubscribe = () => {
                observerCount--;
                originalUnsubscribe();
            };
            return sub;
        };

        const { unmount } = renderHook(() => useObservable(subject, 0));
        expect(observerCount).toBe(1);

        unmount();
        expect(observerCount).toBe(0);
    });
});
