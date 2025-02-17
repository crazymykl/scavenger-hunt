import { useAppSelector } from "../../app/hooks"
import { huntSlice } from "./huntSlice"
import type { ItemView } from "./huntSlice"
import styles from "./Hunt.module.css"

export const Hunt = () => {
  const items: ItemView[] = useAppSelector(huntSlice.selectors.selectItems)

  return (
    <ol className={styles.itemsList}>
      {items.map(item => (
        <li key={item.name}>
          <img src={item.image} alt={item.text}></img>
        </li>
      ))}
    </ol>
  )
}
