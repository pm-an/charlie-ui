import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";

function DevPlayground() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold text-primary">
        @piotr/raycast-ui — Dev Playground
      </h1>
      <p className="mt-2 text-muted-foreground">
        Component library infrastructure is ready. Add components to get
        started.
      </p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DevPlayground />
  </StrictMode>
);
