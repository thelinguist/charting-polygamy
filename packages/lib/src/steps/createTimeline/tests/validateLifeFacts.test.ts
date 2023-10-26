import { afterAll, describe, expect, it, vi } from "vitest"
import { validateLifeFacts } from "../validateLifeFacts"

describe("validateLifeFacts", () => {
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
                death: {
                    date: new Date(),
                },
                marriages: {},
                divorces: {},
            },
        }
        delete tree.Mr[factToDelete]
        expect(validateLifeFacts(tree, "Mr")).toBeFalsy()
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
                death: {
                    date: new Date(),
                },
                marriages: {},
                divorces: {},
            },
        }
        delete tree.Mr[factToDelete].date
        expect(validateLifeFacts(tree, "Mr")).toBeFalsy()
    })

    it("rejects if there is no one in the tree with that name", () => {
        const tree = {
            Mr: {
                name: "Mr",
                marriages: {},
                divorces: {},
            },
        }
        expect(validateLifeFacts(tree, "Mr")).toBeFalsy()
    })

    it.each`
        factToDelete
        ${"birth"}
        ${"death"}
    `(`rejects if the date for $factToDelete is bad`, ({ factToDelete }) => {
        const tree = {
            Mr: {
                name: "Mr",
                birth: {},
                death: {},
                marriages: {},
                divorces: {},
            },
        }
        tree.Mr[factToDelete].date = new Date("invalid")
        expect(validateLifeFacts(tree, "Mr")).toBeFalsy()
    })
})
