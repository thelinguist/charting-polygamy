import { afterAll, describe, expect, it, vi } from "vitest"
import { createTimeline } from "../createTimeline"

describe("createTimeline step", () => {
    const temp = console.error
    console.error = vi.fn()

    afterAll(() => {
        console.error = temp
    })
    it.each`
        factToDelete
        ${"birth"}
        ${"death"}
    `(`rejects if no fact for $factToDelete`, ({ factToDelete }) => {
        const tree = {
            Mr: {
                name: "Mr",
                birth: {
                    date: new Date(),
                },
                death: {},
                marriages: {},
                divorces: {},
            },
        }
        delete tree.Mr[factToDelete]
        return expect(() => createTimeline(tree, "Mr")).toThrowError("could not validate facts for Mr")
    })

    it.each`
        factToDelete
        ${"birth"}
        ${"death"}
    `(`rejects if no date for $factToDelete`, ({ factToDelete }) => {
        const tree = {
            Mr: {
                name: "Mr",
                birth: {
                    date: new Date(),
                },
                death: {},
                marriages: {},
                divorces: {},
            },
        }
        delete tree.Mr[factToDelete].date
        return expect(() => createTimeline(tree, "Mr")).toThrowError("could not validate facts for Mr")
    })

    it("rejects if there is no one in the tree with that name", () => {
        const tree = {
            Mr: {
                name: "Mr",
                marriages: {},
                divorces: {},
            },
        }
        return expect(() => createTimeline(tree, "Dr")).toThrowError("could not validate facts for Dr")
    })
})
