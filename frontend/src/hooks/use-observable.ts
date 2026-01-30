import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

/**
 * Hook to subscribe to an RxJS Observable.
 * 
 * @param observable$ The observable to subscribe to.
 * @param initialValue The initial value to use before the observable emits.
 * @returns The current value of the observable.
 */
export function useObservable<T>(observable$: Observable<T> | undefined, initialValue: T): T;
export function useObservable<T>(observable$: Observable<T> | undefined, initialValue?: T): T | undefined;
export function useObservable<T>(observable$: Observable<T> | undefined, initialValue?: T): T | undefined {
    const [value, setValue] = useState<T | undefined>(initialValue);

    useEffect(() => {
        if (!observable$) {
            return;
        }

        const subscription = observable$.subscribe((val) => {
            setValue(val);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [observable$]);

    return value;
}
