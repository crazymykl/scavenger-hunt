import { Card, Center, SimpleGrid, Stack } from "@mantine/core"
import { QRCodeSVG } from "qrcode.react"
import { useAppSelector } from "../../../app/hooks"
import { huntSlice } from "../huntSlice"
import testHunt from "../testHunt.json"

const Item = ({ id }: { id: string }) => {
  const item = useAppSelector(state =>
    huntSlice.selectors.selectItemById(state, id),
  )

  const code = testHunt.items.find(i => i.id === item?.id)?.checkCode
  const url = new URL(
    `${window.location}/../find/${item?.id}/${code}`,
  ).toString()

  return (
    <Card withBorder>
      <Center>
        <Stack>
          <Center>{item?.name}</Center>
          <QRCodeSVG value={url} />
          <Center>{code}</Center>
        </Stack>
      </Center>
    </Card>
  )
}

export const AdminHunt = () => {
  const itemIds = useAppSelector(huntSlice.selectors.selectItemIds)
  const listItems = itemIds.map(id => <AdminHunt.Item id={id} key={id} />)

  return (
    <>
      <SimpleGrid cols={4}>{listItems}</SimpleGrid>
    </>
  )
}

AdminHunt.Item = Item
