import { beforeAll } from "vitest"
// @ts-expect-error it's fine
import { setProjectAnnotations } from "@storybook/react-vite"
import * as projectAnnotations from "./preview"

const project = setProjectAnnotations([projectAnnotations])
beforeAll(project.beforeAll)
