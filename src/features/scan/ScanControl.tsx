import { Container, Group, Modal } from "@mantine/core"
import { useCallback } from "react"
import type { DetectedBarcode } from "react-barcode-scanner"
import { BarcodeScanner } from "react-barcode-scanner"
import "react-barcode-scanner/polyfill"
import { useNavigate } from "react-router"

export const ScanControl = () => {
  const navigate = useNavigate()
  const checkCode = useCallback(
    (codes: DetectedBarcode[]): void => {
      for (const { rawValue } of codes) {
        const url = URL.parse(rawValue)

        if (url?.origin === window.location.origin) {
          navigate(url.pathname)
          return
        }
      }
    },
    [navigate],
  )

  return (
    <Modal
      opened={true}
      onClose={() => navigate("/")}
      size="auto"
      title="Scan QR Code"
      centered
    >
      <Group>
        <Container w={250} h={250}>
          <BarcodeScanner onCapture={checkCode} />
        </Container>
        You can scan if you want to.
      </Group>
    </Modal>
  )
}
