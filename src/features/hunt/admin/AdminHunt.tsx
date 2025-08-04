import { Card, Center, SimpleGrid, Stack } from "@mantine/core"
import { QRCodeSVG } from "qrcode.react"

import type { Hunt, RawItem, Shadow } from "../lib"

const Item = ({ item }: { item: RawItem }) => {
  const url = new URL(
    `/find/${item.id}/${item.checkCode}`,
    window.location.href,
  ).toString()

  return (
    <Card withBorder>
      <Center>
        <Stack>
          <Center>{item.name}</Center>
          <QRCodeSVG value={url} />
          <Center>{item.checkCode}</Center>
        </Stack>
      </Center>
    </Card>
  )
}

export const AdminHunt = ({ hunt, shadow }: { hunt: Hunt; shadow: Shadow }) => {
  const listItems = hunt.items.map(item => (
    <AdminHunt.Item
      item={{ checkCode: shadow[item.id], ...item }}
      key={item.id}
    />
  ))

  return (
    <SimpleGrid mt={12} cols={4}>
      {listItems}
    </SimpleGrid>
  )
}

AdminHunt.Item = Item
