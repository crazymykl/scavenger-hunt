import { useState } from "react"
import { Button } from "@mantine/core"
import { Link } from "react-router"

import styles from "./ActionButton.module.css"

export const ActionButton = ({ done }: { done: boolean }) => {
  const [seen, setSeen] = useState(false)

  return done ? (
    <Link
      to="/reward"
      className={seen ? undefined : styles.glowingAura}
      onClick={() => setSeen(true)}
    >
      <Button color="green">View Reward</Button>
    </Link>
  ) : (
    <Link to="/scan">
      <Button>Scan</Button>
    </Link>
  )
}
