import { Image, Modal } from "@mantine/core"
import { useNavigate } from "react-router"

import imageStyles from "./images.module.css"

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
      <Image
        src={hunt.rewardImage}
        alt={hunt.rewardText}
        className={imageStyles.hero}
      />
    </Modal>
  )
}
