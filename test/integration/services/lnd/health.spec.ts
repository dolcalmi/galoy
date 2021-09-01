import { isUp, lndStatusEvent } from "@services/lnd/health"
import { unauthenticatedParams } from "@services/lnd/auth"
import { clearAccountLocks } from "test/helpers/redis"

beforeAll(async () => {
  await clearAccountLocks()
})

describe("lndHealth", () => {
  // this is a test health checks on lnd
  it("should emit on started", async () => {
    const handler = jest.fn()
    const node = unauthenticatedParams[0]

    lndStatusEvent.on("started", handler)
    await isUp(node)

    expect(handler).toBeCalledTimes(1)

    lndStatusEvent.removeAllListeners()
  })
})
