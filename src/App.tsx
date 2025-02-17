import "./App.css"
import { ColorSchemeScript, MantineProvider } from "@mantine/core"
import { BrowserRouter, Route, Routes } from "react-router"
import { Counter } from "./features/counter/Counter"
import logo from "./logo.svg"
import { Hunt } from "./features/hunt/Hunt"
import { ThemeToggle } from "./features/theme/ThemeToggle"

const App = () => {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto">
        <div className="App">
          <ThemeToggle />
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Counter />
                      <Hunt />
                    </>
                  }
                />
                <Route
                  path="/find/:code"
                  element={
                    <>
                      <Hunt />
                    </>
                  }
                />
              </Routes>
            </BrowserRouter>
          </header>
        </div>
      </MantineProvider>
    </>
  )
}

export default App
