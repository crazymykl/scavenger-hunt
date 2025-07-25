import "@testing-library/jest-dom/vitest"

import { vi } from "vitest"

const { getComputedStyle } = window
window.getComputedStyle = elt => getComputedStyle(elt)
window.HTMLElement.prototype.scrollIntoView = () => {}
window.HTMLMediaElement.prototype.pause = () => {}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: any) => ({
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
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver
