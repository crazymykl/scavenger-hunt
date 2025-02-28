import "./App.css"
import { Navigate, Route, Routes, useParams } from "react-router"
import { Hunt } from "./features/hunt/Hunt"
import { ThemeToggle } from "./features/theme/ThemeToggle"

const ItemDetailsHelper = ({
  transitionDuration,
}: {
  transitionDuration: number
}) => {
  const { id, code } = useParams()

  return (
    <Hunt.ItemDetails
      id={id!}
      code={code}
      transitionDuration={transitionDuration}
    />
  )
}

const App = ({
  transitionDuration = 1000,
}: {
  transitionDuration?: number
}) => {
  return (
    <div className="App">
      <header className="App-header">
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<Hunt />}>
            <Route
              path="/find/:id/:code?"
              element={
                <ItemDetailsHelper transitionDuration={transitionDuration} />
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </header>
    </div>
  )
}

export default App
