import { Button, SimpleGrid, Stack } from "@mantine/core"
import { Outlet } from "react-router"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { huntSlice } from "./huntSlice"
import { Item } from "./Item"
import { ItemDetails } from "./ItemDetails"

export const Hunt = () => {
  const dispatch = useAppDispatch()
  const itemIds = useAppSelector(huntSlice.selectors.selectItemIds)
  const listItems = itemIds.map(id => <Hunt.Item id={id} key={id} />)

  return (
    <Stack align="center">
      <SimpleGrid cols={4} spacing={0} verticalSpacing={0}>
        {listItems}
      </SimpleGrid>
      <Button
        onClick={() => dispatch(huntSlice.actions.startOver())}
        color="red"
      >
        Reset
      </Button>
      <Outlet />
    </Stack>
  )
}
Hunt.Item = Item
Hunt.ItemDetails = ItemDetails
