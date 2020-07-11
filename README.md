# 🎆 use-rx-observable

> A React hook for adding some [RxJs](https://github.com/ReactiveX/rxjs) magic to your components

```jsx
const [todoItem, fetchToDoItem] = useRxObservable(
  // $ is an observable with values emitted from `fetchToDoItem`
  ($) =>
    $.pipe(
      switchMap((id) =>
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
      ),
      switchMap((res: Response) => res.json())
    ),
  []
);

return (
  <div>
    <button onClick={() => fetchToDoItem(2)} />
    {todoItem && <div>{todoItem.title}</div>}
  </div>
);
```

## Installation

```shell
$ npm i --save use-rx-observable
```

## Usage

```jsx
const seconds = 10;
const [timeLeft] = useRxObservable(
  () =>
    timer(0, 1000).pipe(
      map((i) => seconds - i),
      take(seconds + 1)
    ),
  []
);
return <div>{timeLeft}</div>; // 10... 9... 8...
```

`useRxObservable` takes two arguments - the observable factory and its dependency list (just like in `useCallback`, if a dependency is changed then the observable will be re-created).

```jsx
const [seconds, setSeconds] = useState(10);
const [timeLeft] = useRxObservable(
  () =>
    timer(0, 1000).pipe(
      map((i) => seconds - i),
      take(seconds + 1)
    ),
  [seconds] // deps
);
return <div>{timeLeft}</div>;
```

`useRxObservable` returns a tuple containing the lastest value and the `next` function (of the observable in the callback).

## Tests

This hook is tested using [@testing-library/react-hooks](https://github.com/testing-library/react-hooks-testing-library)

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)
