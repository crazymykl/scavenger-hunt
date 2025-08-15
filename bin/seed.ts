#!/usr/bin/env vite-node
import { writeFileSync } from "node:fs"

import { bakeRawHunt } from "../src/features/hunt/lib"
import testHunt from "../src/features/hunt/testHunt.json"

const { hunt, shadow } = bakeRawHunt(testHunt)
const writeJson = (path: string, data: object): void =>
  writeFileSync(path, JSON.stringify(data, null, 2))

writeJson("public/hunt.json", hunt)
writeJson("public/hunt.shadow.json", shadow)
