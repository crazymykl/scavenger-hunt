import { Button } from "@mantine/core"
import { Outlet } from "react-router"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import styles from "./Hunt.module.css"
import { huntSlice } from "./huntSlice"
import { Item } from "./Item"
import { ItemDetails } from "./ItemDetails"

export const Hunt = () => {
  const dispatch = useAppDispatch()
  const itemIds = useAppSelector(huntSlice.selectors.selectItemIds)
  const listItems = itemIds.map(id => <Hunt.Item id={id} key={id} />)

  return (
    <>
      <ol className={styles.itemsList}>{listItems}</ol>
      <Button
        onClick={() => dispatch(huntSlice.actions.startOver())}
        color="red"
      >
        Reset
      </Button>
      <Outlet />
    </>
  )
}
Hunt.Item = Item
Hunt.ItemDetails = ItemDetails
