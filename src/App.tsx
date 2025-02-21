import "./App.css"
import { ColorSchemeScript, MantineProvider } from "@mantine/core"
import { Navigate, Route, Routes, useParams } from "react-router"
import { Hunt, ItemDetails } from "./features/hunt/Hunt"
import { ThemeToggle } from "./features/theme/ThemeToggle"

const ItemDetailsHelper = () => <ItemDetails id={useParams().id!} />

const App = () => {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto">
        <div className="App">
          <header className="App-header">
            <ThemeToggle />
            <Routes>
              <Route path="/" element={<Hunt />}>
                <Route
                  path="/find/:id/:code?"
                  element={<ItemDetailsHelper />}
                />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </header>
        </div>
      </MantineProvider>
    </>
  )
}

export default App
