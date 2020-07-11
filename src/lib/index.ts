import {
  useRef,
  useEffect,
  useState,
  useCallback,
  DependencyList,
} from 'react';
import { Observable, Subject } from 'rxjs';

export function useRxObservable<T, R>(
  factory: ($: Observable<T>) => Observable<R>,
  deps: DependencyList
): [R | undefined, (next: T) => void] {
  const [observableOutput, setObservableOutput] = useState<R>();
  const subjectRef = useRef<Subject<T>>(new Subject<T>());

  const pipeCallback = useCallback(factory, deps);

  const next = useCallback((val: T) => {
    subjectRef.current.next(val);
  }, []);

  useEffect(() => {
    const subscripiton = pipeCallback(
      subjectRef.current.asObservable()
    ).subscribe((nextValue) => setObservableOutput(nextValue));
    return () => {
      subscripiton.unsubscribe();
    };
  }, [pipeCallback]);

  return [observableOutput, next];
}
