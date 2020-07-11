import { renderHook, act } from '@testing-library/react-hooks';
import { useRxObservable } from '../lib';
import { of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

test('should subscribe to the observable', () => {
  const { result } = renderHook(() => useRxObservable(($) => $, []));

  act(() => {
    result.current[1](5);
  });

  expect(result.current[0]).toBe(5);
});

test('should emit the latest value', () => {
  const { result } = renderHook(() => useRxObservable(($) => $, []));

  act(() => {
    result.current[1](1);
    result.current[1](2);
    result.current[1](3);
  });

  expect(result.current[0]).toBe(3);
});

test('should pipe the observable to the operators', () => {
  const { result } = renderHook(() =>
    useRxObservable(($) => $.pipe(mapTo(4)), [])
  );

  act(() => {
    result.current[1](5);
  });

  expect(result.current[0]).toBe(4);
});

test('should pipe the observable', () => {
  const { result } = renderHook(() =>
    useRxObservable(($) => $.pipe(mapTo(4)), [])
  );

  act(() => {
    result.current[1](5);
  });

  expect(result.current[0]).toBe(4);
});

test('should re-pipe the observable when a dependency has changed', () => {
  let mapToArg = 4;
  const { result, rerender } = renderHook(() =>
    useRxObservable(($) => $.pipe(mapTo(mapToArg)), [mapToArg])
  );

  mapToArg = 3;
  rerender();
  act(() => {
    result.current[1](5);
  });

  expect(result.current[0]).toBe(3);
});

test('should not re-pipe the observable when a something variable is not a dependecy changed', () => {
  let mapToArg = 4;
  const { result, rerender } = renderHook(() =>
    useRxObservable(($) => $.pipe(mapTo(mapToArg)), [])
  );

  mapToArg = 3;
  rerender();
  act(() => {
    result.current[1](5);
  });

  expect(result.current[0]).toBe(4);
});

test('should create a whole new observable in the callback', () => {
  const { result } = renderHook(() => useRxObservable(() => of(2), []));

  expect(result.current[0]).toBe(2);
});
