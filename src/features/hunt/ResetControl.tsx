import { huntSlice } from "./huntSlice"
import { useAppDispatch } from "../../app/hooks"
import { useNavigate } from "react-router"
import { Button, Center, Group, Modal } from "@mantine/core"

export const ResetControl = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <Modal
      opened={true}
      onClose={() => navigate("/")}
      size="md"
      title="Your progress will be reset. Are you sure?"
      centered
    >
      <Center>
        <Group>
          <Button
            onClick={() => {
              dispatch(huntSlice.actions.startOver())
              navigate("/")
            }}
            color="red"
          >
            Reset
          </Button>
          <Button onClick={() => navigate("/")}>Cancel</Button>
        </Group>
      </Center>
      <small>
        Please close any other open tabs of this game before resetting.
      </small>
    </Modal>
  )
}
