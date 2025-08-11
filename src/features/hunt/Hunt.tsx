import { SimpleGrid, Stack } from "@mantine/core"
import { Outlet } from "react-router"

import { Intro } from "./Intro"
import { Item } from "./Item"
import { ItemDetails } from "./ItemDetails"
import { Reward } from "./Reward"
import { useWindowDimensions } from "../../app/hooks"

import type { Hunt as HuntData } from "./lib"

export const Hunt = ({ hunt }: { hunt: HuntData }) => {
  const CELL_SPACING = 2
  const { height, width } = useWindowDimensions()
  const listItems = hunt.items.map(item => (
    <Hunt.Item item={item} key={item.id} />
  ))

  return (
    <Stack align="center">
      <SimpleGrid
        cols={width > height ? 6 : 3}
        spacing={CELL_SPACING}
        verticalSpacing={CELL_SPACING}
        mt={CELL_SPACING}
      >
        {listItems}
      </SimpleGrid>
      <Outlet />
    </Stack>
  )
}
Hunt.Item = Item
Hunt.ItemDetails = ItemDetails
Hunt.Reward = Reward
Hunt.Intro = Intro
