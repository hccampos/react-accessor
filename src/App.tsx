import React from "react";
import { Counter } from "./Counter";
import { observer } from "./utils/observer";

// NOTE: don't do this :) Maybe use context to provide a counter.
const counter = new Counter({ value: 0 });

const App = observer(() => {
  return (
    <div className="counter-container">
      <div>Counter Value is: {counter.counterValue}</div>
      <button onClick={() => counter.increment()}>+</button>
      <button onClick={() => counter.decrement()}>-</button>
    </div>
  );
});

export default App;
