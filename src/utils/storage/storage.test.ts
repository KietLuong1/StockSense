import { load, loadString, save, saveString, clear, remove, storage, getAllKeys } from "./storage"

const VALUE_OBJECT = { x: 1 }
const VALUE_STRING = JSON.stringify(VALUE_OBJECT)

describe("AsyncStorage", () => {
  beforeEach(async () => {
    await storage.clearAll()
    await storage.set("string", "string")
    await storage.set("object", JSON.stringify(VALUE_OBJECT))
  })

  it("should be defined", () => {
    expect(storage).toBeDefined()
  })

  it("should have default keys", async () => {
    const keys = await storage.getAllKeys()
    expect(keys).toEqual(expect.arrayContaining(["string", "object"]))
  })

  it("should load data", async () => {
    const objectData = await load<object>("object")
    expect(objectData).toEqual(VALUE_OBJECT)

    const objectString = await loadString("object")
    expect(objectString).toEqual(VALUE_STRING)

    const stringData = await load<string>("string")
    expect(stringData).toEqual("string")

    const stringString = await loadString("string")
    expect(stringString).toEqual("string")
  })

  it("should save strings", async () => {
    await saveString("string", "new string")
    const result = await loadString("string")
    expect(result).toEqual("new string")
  })

  it("should save objects", async () => {
    await save("object", { y: 2 })
    const result1 = await load<object>("object")
    expect(result1).toEqual({ y: 2 })

    await save("object", { z: 3, also: true })
    const result2 = await load<object>("object")
    expect(result2).toEqual({ z: 3, also: true })
  })

  it("should save strings and objects", async () => {
    await saveString("object", "new string")
    const result = await loadString("object")
    expect(result).toEqual("new string")
  })

  it("should remove data", async () => {
    await remove("object")
    const objectData = await load<object>("object")
    expect(objectData).toBeNull()

    const keys1 = await storage.getAllKeys()
    expect(keys1).toEqual(expect.arrayContaining(["string"]))
    expect(keys1).not.toEqual(expect.arrayContaining(["object"]))

    await remove("string")
    const stringData = await load<string>("string")
    expect(stringData).toBeNull()

    const keys2 = await getAllKeys()
    expect(keys2).not.toEqual(expect.arrayContaining(["string"]))
  })

  it("should clear all data", async () => {
    const keys1 = await storage.getAllKeys()
    expect(keys1).toEqual(expect.arrayContaining(["string", "object"]))

    await clear()

    const keys2 = await storage.getAllKeys()
    expect(keys2).toEqual([])
  })
})
