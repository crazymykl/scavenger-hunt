import { Group, Image, Modal, Paper, Text } from "@mantine/core"
import { useNavigate } from "react-router"

import type { Hunt } from "./lib"

export const Reward = ({ hunt }: { hunt: Hunt }) => {
  const navigate = useNavigate()

  return (
    <Modal
      opened={true}
      onClose={() => navigate("/")}
      size="auto"
      title={hunt.rewardTitle}
      centered
    >
      <Group>
        <Image src={hunt.rewardImage} alt="Reward" w={250} />
        <Paper w={250}>
          <Text>{hunt.rewardText}</Text>
        </Paper>
      </Group>
    </Modal>
  )
}
