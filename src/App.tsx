import "./App.css"
import { ColorSchemeScript, MantineProvider } from "@mantine/core"
import { Counter } from "./features/counter/Counter"
import logo from "./logo.svg"

const App = () => {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto">
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Counter />
          </header>
        </div>
      </MantineProvider>
    </>
  )
}

export default App
