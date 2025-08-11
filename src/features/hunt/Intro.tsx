import { Group, Image, Modal, Paper, Text } from "@mantine/core"
import { useNavigate } from "react-router"

import type { Hunt } from "./lib"

export const Intro = ({ hunt }: { hunt: Hunt }) => {
  const navigate = useNavigate()

  return (
    <Modal
      opened={true}
      onClose={() => navigate("/")}
      size="auto"
      title={hunt.introTitle}
      centered
    >
      <Group>
        <Image src={hunt.introImage} alt="Intro" w={250} />
        <Paper w={250}>
          <Text>{hunt.introText}</Text>
        </Paper>
      </Group>
    </Modal>
  )
}
