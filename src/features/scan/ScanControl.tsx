import { useCallback } from "react"
import { Container, Group, Modal, Text } from "@mantine/core"
import { BarcodeScanner } from "react-barcode-scanner"
import { useNavigate } from "react-router"

import type { DetectedBarcode } from "react-barcode-scanner"

import "react-barcode-scanner/polyfill"

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
      <Group justify="center">
        <Container w={250} h={250} p={0}>
          <BarcodeScanner onCapture={checkCode} />
        </Container>
        <Text w={250} span ta="center">
          Point your camera at a QR code to scan it. If it is a part of this
          hunt, you will automatically fill the square it represents.
          <br />
          <br />
          Alternatively, you can manually enter the numeric code next to the QR
          code into the item square indicated nearby.
        </Text>
      </Group>
    </Modal>
  )
}
