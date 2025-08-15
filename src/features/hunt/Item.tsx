import { Image } from "@mantine/core"
import { Link } from "react-router"

import styles from "./Item.module.css"
import { huntSlice } from "./huntSlice"
import { useAppSelector } from "../../app/hooks"

import type { Item as ItemData } from "./lib"

export const Item = ({ item }: { item: ItemData }) => {
  const progress = useAppSelector(state =>
    huntSlice.selectors.selectProgressById(state, item.id),
  )

  const [imageSrc, imageAlt] =
    progress === "unfound"
      ? [item.searchImage, item.searchText]
      : [item.foundImage, item.foundText]

  return (
    <>
      <Link to={`/find/${item.id}`} className={styles.nameOverlay}>
        {progress === "unfound" && <span>{item.name}</span>}
        <Image src={imageSrc} alt={imageAlt} />
      </Link>
    </>
  )
}
