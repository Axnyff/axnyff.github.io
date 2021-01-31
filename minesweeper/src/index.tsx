import React from "react";
import { render } from "react-dom";
import App from "./App";

render(<App />, document.getElementById("app"));
if (process.env.NODE_ENV === "development") {
  (module as any).hot.accept();
}
