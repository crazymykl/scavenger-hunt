import { SimpleGrid, Stack } from "@mantine/core"
import { Outlet } from "react-router"
import { useAppSelector, useWindowDimensions } from "../../app/hooks"
import { huntSlice } from "./huntSlice"
import { Item } from "./Item"
import { ItemDetails } from "./ItemDetails"

const CELL_SPACING = 5

export const Hunt = () => {
  const { height, width } = useWindowDimensions()
  const itemIds = useAppSelector(huntSlice.selectors.selectItemIds)
  const listItems = itemIds.map(id => <Hunt.Item id={id} key={id} />)

  return (
    <Stack align="center">
      <SimpleGrid
        cols={width > height ? 6 : 3}
        spacing={CELL_SPACING}
        verticalSpacing={CELL_SPACING}
      >
        {listItems}
      </SimpleGrid>
      <Outlet />
    </Stack>
  )
}
Hunt.Item = Item
Hunt.ItemDetails = ItemDetails
Hunt.CELL_SPACING = CELL_SPACING
