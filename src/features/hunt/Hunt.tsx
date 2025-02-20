import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { huntSlice } from "./huntSlice"
import styles from "./Hunt.module.css"
import { Button, Group, Modal, Text } from "@mantine/core"
import { Link, Navigate, Outlet, useNavigate } from "react-router"

export const Item = ({ id }: { id: string }) => {
  const item = useAppSelector(state =>
    huntSlice.selectors.selectItemById(state, id),
  )
  const progress = useAppSelector(state =>
    huntSlice.selectors.selectProgressById(state, id),
  )

  if (!item) return <div data-testid="missingItem" />

  if (progress === "unfound") {
    return (
      <li>
        <Link to={`/find/${item.id}`}>
          <img src={item.searchImage} alt={item.searchText}></img>
        </Link>
      </li>
    )
  }
  return (
    <li>
      <Link to={`/find/${item.id}`}>
        <img src={item.foundImage} alt={item.foundText}></img>
      </Link>
    </li>
  )
}

export const ItemDetails = ({ id }: { id: string }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const item = useAppSelector(state =>
    huntSlice.selectors.selectItemById(state, id),
  )
  const progress = useAppSelector(state =>
    huntSlice.selectors.selectProgressById(state, id),
  )

  if (!item) return <Navigate to="/" replace />

  const modalBody =
    progress === "unfound" ? (
      <Group>
        <img src={item.searchImage} alt="" width="300" height="300"></img>
        <Text>{item.searchText}</Text>
        <Button
          onClick={() => dispatch(huntSlice.actions.markItemFound(item.id))}
        >
          Find
        </Button>
      </Group>
    ) : (
      <Group>
        <img src={item.foundImage} alt="" width="300" height="300"></img>
        <Text>{item.foundText}</Text>
      </Group>
    )

  return (
    <Modal
      opened={true}
      onClose={() => navigate("/")}
      size={"xl"}
      title={item.name}
      centered
    >
      {modalBody}
    </Modal>
  )
}

export const Hunt = () => {
  const dispatch = useAppDispatch()
  const itemIds = useAppSelector(huntSlice.selectors.selectItemIds)
  const listItems = itemIds.map(id => <Item id={id} key={id} />)

  return (
    <>
      <ol className={styles.itemsList}>{listItems}</ol>
      <Button
        onClick={() => dispatch(huntSlice.actions.startOver())}
        color="red"
      >
        Reset
      </Button>
      <Outlet />
    </>
  )
}
