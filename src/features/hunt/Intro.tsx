import { Image, Modal } from "@mantine/core"
import { useNavigate } from "react-router"

import imageStyles from "./images.module.css"

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
      <Image
        src={hunt.introImage}
        alt={hunt.introText}
        className={imageStyles.hero}
      />
    </Modal>
  )
}
