import moment from "moment"
import { getHash } from "@core/utils"
import { getUserWallet } from "test/helpers"
import { parsePaymentRequest } from "invoices"
import { InvoiceUser } from "@services/mongoose/schema"
import liquidityProvider from "@core/liquidity-provider"

jest.mock("@services/realtime-price", () => require("test/mocks/realtime-price"))
jest.mock("@services/phone-provider", () => require("test/mocks/phone-provider"))

let userWallet1

beforeAll(async () => {
  userWallet1 = await getUserWallet(1)
})

describe("UserWallet - addInvoice", () => {
  it("adds a self generated invoice", async () => {
    const request = await userWallet1.addInvoice({ value: 1000 })
    expect(request.startsWith("lnbcrt10")).toBeTruthy()

    const { uid } = await InvoiceUser.findById(getHash(request))
    expect(String(uid)).toBe(String(userWallet1.user._id))

    const { tokens, created_at, expires_at } = await parsePaymentRequest({ request })
    expect(tokens).toBe(1000)

    const hoursDiff = moment.duration(moment(expires_at).diff(created_at)).asHours()
    expect(hoursDiff).toBeCloseTo(24, 0)
  })

  it("adds a self generated invoice without amount", async () => {
    const request = await userWallet1.addInvoice({})
    const { uid } = await InvoiceUser.findById(getHash(request))
    expect(String(uid)).toBe(String(userWallet1.user._id))
  })

  it("adds a public invoice", async () => {
    const request = await userWallet1.addInvoice({ selfGenerated: false })
    expect(request.startsWith("lnbcrt1")).toBeTruthy()
    const { uid, selfGenerated } = await InvoiceUser.findById(getHash(request))
    expect(String(uid)).toBe(String(userWallet1.user._id))
    expect(selfGenerated).toBe(false)
  })

  it("adds a USD invoice", async () => {
    const amount = 10
    const currency = "USD"

    const request = await userWallet1.addInvoice({ currency, value: amount })
    const { tokens, created_at, expires_at } = await parsePaymentRequest({ request })

    const minutesDiff = moment.duration(moment(expires_at).diff(created_at)).asMinutes()
    expect(minutesDiff).toBeCloseTo(2, 0)

    const liquidity = await liquidityProvider.checkLiquidity({ currency, amount })
    expect(tokens).toBe(liquidity?.amount)

    const { uid } = await InvoiceUser.findById(getHash(request))
    expect(String(uid)).toBe(String(userWallet1.user._id))
  })
})
