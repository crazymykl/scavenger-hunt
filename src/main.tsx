import React from "react"
import { ColorSchemeScript, MantineProvider } from "@mantine/core"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router"

import App from "./App"
import { store } from "./app/store"
import "./index.css"
import { RememberGate } from "./features/remember/RememberGate"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ColorSchemeScript defaultColorScheme="auto" />
        <MantineProvider defaultColorScheme="auto">
          <RememberGate>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </RememberGate>
        </MantineProvider>
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
