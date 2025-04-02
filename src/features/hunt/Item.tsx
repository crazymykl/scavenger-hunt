import { Link } from "react-router"
import { Image } from "@mantine/core"
import { useAppSelector } from "../../app/hooks"
import { huntSlice } from "./huntSlice"

export const Item = ({ id }: { id: string }) => {
  const item = useAppSelector(state =>
    huntSlice.selectors.selectItemById(state, id),
  )
  const progress = useAppSelector(state =>
    huntSlice.selectors.selectProgressById(state, id),
  )

  if (!item) return <div data-testid="missingItem" />

  const [imageSrc, imageAlt] =
    progress === "unfound"
      ? [item.searchImage, item.searchText]
      : [item.foundImage, item.foundText]

  return (
    <>
      <Link to={`/find/${item.id}`}>
        <Image src={imageSrc} alt={imageAlt} />
      </Link>
    </>
  )
}
