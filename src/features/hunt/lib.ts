import cyrb53 from "cyrb53"

type BaseItem = {
  id: string
  name: string
  searchText: string
  searchImage: string
  foundText: string
  foundImage: string
}

export type RawItem = BaseItem & {
  checkCode: string
}

export type Item = BaseItem & {
  checkCode?: never
  checkHash: string
}

export type RawHunt = {
  name: string
  introTitle: string
  introText: string
  introImage: string
  rewardTitle: string
  rewardText: string
  rewardImage: string
  items: RawItem[]
}

export type Shadow = Record<string, string>

export type Hunt = Omit<RawHunt, "items"> & {
  items: Item[]
}

export const validCode = (item: Item, code: string): boolean =>
  item.checkHash === hashCode(code)

const hashCode = (code: string): string =>
  cyrb53(code).toString(36).padStart(7, "0")

const hashCheckCode = ({ checkCode, ...item }: RawItem): Item => ({
  ...item,
  checkHash: hashCode(checkCode),
})

const hashCheckHunt = ({ items, ...rest }: RawHunt): Hunt => ({
  ...rest,
  items: items.map(hashCheckCode),
})

export const bakeRawHunt = (
  raw: RawHunt,
): {
  hunt: Hunt
  shadow: Shadow
} => ({
  hunt: hashCheckHunt(raw),
  shadow: raw.items.reduce(
    (acc, item) => ({
      ...acc,
      [item.id]: item.checkCode,
    }),
    {},
  ),
})
