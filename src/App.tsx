import "./App.css"
import { Navigate, Route, Routes, useParams } from "react-router"
import { Hunt } from "./features/hunt/Hunt"
import { ThemeToggle } from "./features/theme/ThemeToggle"

const ItemDetailsHelper = () => {
  const { id, code } = useParams()

  return <Hunt.ItemDetails id={id!} code={code} />
}

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<Hunt />}>
            <Route path="/find/:id/:code?" element={<ItemDetailsHelper />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </header>
    </div>
  )
}

export default App
