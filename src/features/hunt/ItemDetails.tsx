import { createRef, useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router"
import {
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
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import type { Item } from "./huntSlice"
import { huntSlice } from "./huntSlice"

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
  const item = useAppSelector(state =>
    huntSlice.selectors.selectItemById(state, id),
  )
  const progress = useAppSelector(state =>
    huntSlice.selectors.selectProgressById(state, id),
  )

  if (!item) return <Navigate to="/" replace />

  const modalBody =
    progress === "unfound" ? (
      <UnfoundItemDetailsBody
        item={item}
        code={code?.substring(0, 6) ?? ""}
        transitionDuration={transitionDuration}
      />
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

const UnfoundItemDetailsBody = ({
  item,
  code,
  transitionDuration,
}: {
  item: Item
  code: string
  transitionDuration?: number
}) => {
  const dispatch = useAppDispatch()
  const [codeInputState, setCodeInputState] = useState<CodeInputState>({
    state: "ready",
  })
  const [value, setValue] = useState(code)
  const pinRef = createRef<HTMLInputElement>()

  useEffect(() => {
    switch (codeInputState.state) {
      case "check":
        setTimeout(() => {
          const x = { id: item.id, code: codeInputState.code }

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
  }, [codeInputState, dispatch, item.id, pinRef, transitionDuration])

  return (
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
  )
}
