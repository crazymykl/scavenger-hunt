import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { huntSlice } from "./huntSlice"
import styles from "./Hunt.module.css"
import {
  Button,
  FocusTrap,
  Group,
  Modal,
  PinInput,
  Text,
  Image,
  Center,
  Progress,
  Stack,
} from "@mantine/core"
import { Link, Navigate, Outlet, useNavigate } from "react-router"
import { createRef, useEffect, useState } from "react"

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
    <li>
      <Link to={`/find/${item.id}`}>
        <Image src={imageSrc} alt={imageAlt} />
      </Link>
    </li>
  )
}

type CodeInputState =
  | { state: "ready" }
  | { state: "check"; code: string }
  | { state: "error" }

const validCode = ({ id, code }: { id: string; code: string }) =>
  id && code === "111111"

export const ItemDetails = ({
  id,
  code,
  transitionDuration = 750,
}: {
  id: string
  code?: string
  transitionDuration?: number
}) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const item = useAppSelector(state =>
    huntSlice.selectors.selectItemById(state, id),
  )
  const progress = useAppSelector(state =>
    huntSlice.selectors.selectProgressById(state, id),
  )
  const [codeInputState, setCodeInputState] = useState<CodeInputState>({
    state: "ready",
  })
  const [value, setValue] = useState(code?.substring(0, 6) ?? "")
  const pinRef = createRef<HTMLInputElement>()
  
  if (!item) return <Navigate to="/" replace />

  useEffect(() => {
    switch (codeInputState.state) {
      case "check":
        setTimeout(() => {
          const x = { id, code: codeInputState.code }
  
          if (validCode(x)) dispatch(huntSlice.actions.markItemFound(x))
          else setCodeInputState({ state: "error" })
        }, transitionDuration)
        break
      case "error":
        setTimeout(() => {
          setValue("")
          pinRef.current?.focus()
          setCodeInputState({ state: "ready" })
        }, transitionDuration)
        break
    }
  }, [codeInputState])

  const modalBody =
    progress === "unfound" ? (
      <>
        <Group mb="1rem">
          <Image src={item.searchImage} w={250} />
          <Text>{item.searchText}</Text>
        </Group>
        <Center>
          <Stack>
            <PinInput
              value={value}
              length={6}
              oneTimeCode={false}
              type="number"
              disabled={codeInputState.state === "check"}
              error={codeInputState.state === "error"}
              ref={pinRef}
              onChange={setValue}
              onComplete={code => setCodeInputState({ state: "check", code })}
            />
            <Progress
              value={codeInputState.state === "check" ? 100 : 0}
              animated
              w="100%"
              color={codeInputState.state === "error" ? "red" : undefined}
              transitionDuration={transitionDuration}
            />
          </Stack>
        </Center>
        {/* work around Mantine PinInput's lack of data-autofocus support */}
        <FocusTrap.InitialFocus onFocus={() => pinRef.current?.focus()} />
      </>
    ) : (
      <Group>
        <Image src={item.foundImage} w={250} />
        <Text>{item.foundText}</Text>
      </Group>
    )

  return (
    <Modal
      opened={true}
      onClose={() => navigate("/")}
      size={"auto"}
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
