import "@testing-library/jest-dom/vitest"

import { vi } from "vitest"

const { getComputedStyle } = window // eslint-disable-line @typescript-eslint/unbound-method
window.getComputedStyle = elt => getComputedStyle(elt)
window.HTMLElement.prototype.scrollIntoView = vi.fn()
window.HTMLMediaElement.prototype.pause = vi.fn()

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: unknown) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

class ResizeObserver {
  observe: () => void = vi.fn()
  unobserve: () => void = vi.fn()
  disconnect: () => void = vi.fn()
}

window.ResizeObserver = ResizeObserver
