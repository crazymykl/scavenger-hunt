import { Container, Group, Modal } from "@mantine/core"
import { useCallback } from "react"
import type { DetectedBarcode } from "react-barcode-scanner"
import { BarcodeScanner } from "react-barcode-scanner"
import "react-barcode-scanner/polyfill"
import { useNavigate } from "react-router"

export const handleCodes = (
  codes: DetectedBarcode[],
  callback: (path: string) => void,
): void => {
  const path = codes
    .map(({ rawValue }) => URL.parse(rawValue))
    .find(url => url?.origin === window.location.origin)?.pathname

  if (path) callback(path)
}

export const ScanControl = ({
  onCapture = handleCodes,
}: {
  onCapture?: typeof handleCodes
}) => {
  const navigate = useNavigate()
  const checkCode = useCallback(
    (codes: DetectedBarcode[]) => onCapture(codes, navigate),
    [onCapture, navigate],
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
