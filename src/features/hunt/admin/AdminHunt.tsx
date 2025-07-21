import { Card, Center, SimpleGrid, Stack } from "@mantine/core"
import { QRCodeSVG } from "qrcode.react"
import type { Hunt, RawItem } from "../../../services/api"

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

export const AdminHunt = ({ hunt }: { hunt: Hunt }) => {
  const listItems = hunt?.items.map(item => (
    <AdminHunt.Item item={{ checkCode: "", ...item }} key={item.id} />
  ))

  return (
    <SimpleGrid mt={12} cols={4}>
      {listItems}
    </SimpleGrid>
  )
}

AdminHunt.Item = Item
