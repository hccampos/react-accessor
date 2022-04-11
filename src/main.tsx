import React, { StrictMode } from "react";
import { render } from "react-dom";
import App from "./App";
import SceneView from "@arcgis/core/views/SceneView";
import Map from "@arcgis/core/Map";
import "./main.css";

const reactWidget = document.createElement("div");

render(
  <StrictMode>
    <App />
  </StrictMode>,
  reactWidget
);

const view = new SceneView({
  container: "viewDiv",
  map: new Map({ basemap: "topo", ground: "world-elevation" }),
  qualityProfile: "high",
});

view.ui.add(reactWidget, "top-right");
