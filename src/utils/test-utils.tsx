import { ColorSchemeScript, MantineProvider } from "@mantine/core"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { MemoryRouter, useLocation } from "react-router"

import { makeStore } from "../app/store"
import { bakeRawHunt } from "../features/hunt/lib"
import testHunt from "../features/hunt/testHunt.json"
import { api } from "../services/api"

import type { PropsWithChildren, ReactElement } from "react"
import type { FetchBaseQueryArgs } from "@reduxjs/toolkit/query"
import type { RenderOptions } from "@testing-library/react"
import type { AppStore, RootState } from "../app/store"

/**
 * This type extends the default options for
 * React Testing Library's render function. It allows for
 * additional configuration such as specifying an initial Redux state and
 * a custom store instance.
 */
type ExtendedRenderOptions = {
  /**
   * Defines a specific portion or the entire initial state for the Redux store.
   * This is particularly useful for initializing the state in a
   * controlled manner during testing, allowing components to be rendered
   * with predetermined state conditions.
   */
  preloadedState?: Partial<RootState>

  /**
   * Allows the use of a specific Redux store instance instead of a
   * default or global store. This flexibility is beneficial when
   * testing components with unique store requirements or when isolating
   * tests from a global store state. The custom store should be configured
   * to match the structure and middleware of the store used by the application.
   *
   * @default makeStore(preloadedState)
   */
  store?: AppStore

  route?: string
  preloadHunt?: boolean
  preloadShadow?: boolean
} & Omit<RenderOptions, "queries">

/**
 * Renders the given React element with Redux Provider and custom store.
 * This function is useful for testing components that are connected to the Redux store.
 *
 * @param ui - The React component or element to render.
 * @param extendedRenderOptions - Optional configuration options for rendering. This includes `preloadedState` for initial Redux state and `store` for a specific Redux store instance. Any additional properties are passed to React Testing Library's render function.
 * @returns An object containing the Redux store used in the render, User event API for simulating user interactions in tests, and all of React Testing Library's query functions for testing the component.
 */
export const renderWithProviders = (
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) => {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = makeStore(preloadedState, {
      overrideBaseQueryArgs: mockedBaseQueryArgs,
    }),
    route = "/",
    preloadHunt = true,
    preloadShadow = false,
    ...renderOptions
  } = extendedRenderOptions

  const Wrapper = ({ children }: PropsWithChildren) => {
    const LocationSpy = ({ children }: PropsWithChildren) => (
      <span data-url={useLocation().pathname} data-testid="url">
        {children}
      </span>
    )

    const ApiPreloader = ({
      children,
      preloadHunt,
      preloadShadow,
    }: PropsWithChildren<{
      preloadHunt: boolean
      preloadShadow: boolean
    }>) => {
      if (preloadHunt) {
        const [getHunt, { isUninitialized: huntUninit }] =
          api.useLazyGetHuntQuery()
        if (huntUninit) void getHunt(undefined)
      }
      if (preloadShadow) {
        const [getShadow, { isUninitialized: shadowUninit }] =
          api.useLazyGetShadowQuery()
        if (shadowUninit) void getShadow(undefined)
      }

      return children
    }

    return (
      <Provider store={store}>
        <ColorSchemeScript defaultColorScheme="auto" />
        <MantineProvider defaultColorScheme="auto">
          <MemoryRouter initialEntries={[route]}>
            <ApiPreloader
              preloadHunt={preloadHunt}
              preloadShadow={preloadShadow}
            >
              <LocationSpy>{children}</LocationSpy>
            </ApiPreloader>
          </MemoryRouter>
        </MantineProvider>
      </Provider>
    )
  }

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

export const qrCode = (rawValue: string) => ({
  rawValue,
  format: "qr_code",
  cornerPoints: [],
  boundingBox: {
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: vi.fn(),
  },
})

export const { hunt, shadow } = bakeRawHunt(testHunt)

const requestUrl = (ri: RequestInfo): URL =>
  new URL(typeof ri === "string" ? /* v8 ignore next */ ri : ri.url)

const [huntJson, shadowJson] = [JSON.stringify(hunt), JSON.stringify(shadow)]

const mockedBaseQueryArgs: FetchBaseQueryArgs = {
  baseUrl: "http://bogus.host/",
  fetchFn: async (info, _init) => {
    const { pathname } = requestUrl(info)

    switch (pathname) {
      case "/hunt.json":
        return Promise.resolve(new Response(huntJson))
      case "/hunt.shadow.json":
        return Promise.resolve(new Response(shadowJson))
      default: /* v8 ignore start */
        throw new Error(`Not found: "${pathname}"`)
      /* v8 ignore stop */
    }
  },
}

export const loadingDone = () =>
  waitFor(() =>
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument(),
  )

export const getUrl = () => screen.getByTestId("url").dataset.url
