import { Wallets } from "@app"
import { addWallet } from "@app/accounts/add-wallet"
import { getCurrentPrice } from "@app/prices"
import {
  getInvoiceCreateAttemptLimits,
  getInvoiceCreateForRecipientAttemptLimits,
} from "@config"
import { decodeInvoice } from "@domain/bitcoin/lightning"
import { CENTS_PER_USD } from "@domain/fiat"
import {
  InvoiceCreateForRecipientRateLimiterExceededError,
  InvoiceCreateRateLimiterExceededError,
} from "@domain/rate-limit/errors"
import { WalletCurrency, WalletType } from "@domain/wallets"
import { WalletInvoicesRepository } from "@services/mongoose"

import {
  createUserAndWalletFromUserRef,
  getAccountIdByTestUserRef,
  getDefaultWalletIdByTestUserRef,
  getHash,
} from "test/helpers"
import {
  resetRecipientAccountIdLimits,
  resetSelfAccountIdLimits,
} from "test/helpers/rate-limit"

let walletIdBtc: WalletId
let walletIdUsd: WalletId
let accountIdB: AccountId

jest.mock("@app/prices/get-current-price", () => require("test/mocks/get-current-price"))
jest.mock("@services/dealer-price", () => require("test/mocks/dealer-price"))

const walletInvoices = WalletInvoicesRepository()

beforeAll(async () => {
  const userRef = "B"
  await createUserAndWalletFromUserRef(userRef)

  walletIdBtc = await getDefaultWalletIdByTestUserRef(userRef)
  accountIdB = await getAccountIdByTestUserRef(userRef)

  const wallet = await addWallet({
    accountId: accountIdB,
    type: WalletType.Checking,
    currency: WalletCurrency.Usd,
  })
  if (wallet instanceof Error) return wallet
  walletIdUsd = wallet.id
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe("Wallet - addInvoice BTC", () => {
  it("add a self generated invoice", async () => {
    const amountInput = 1000

    const lnInvoice = await Wallets.addInvoiceForSelf({
      walletId: walletIdBtc,
      amount: amountInput,
    })
    if (lnInvoice instanceof Error) throw lnInvoice
    const { paymentRequest: request } = lnInvoice

    expect(request.startsWith("lnbcrt10")).toBeTruthy()
    const result = await walletInvoices.findByPaymentHash(getHash(request))
    if (result instanceof Error) throw result
    const { walletId, currency } = result
    expect(walletId).toBe(walletIdBtc)
    expect(currency).toBe(WalletCurrency.Btc)

    const decodedInvoice = decodeInvoice(request)
    if (decodedInvoice instanceof Error) throw decodedInvoice

    const { amount } = decodedInvoice
    expect(amount).toBe(amountInput)
  })

  it("add a self generated invoice without amount", async () => {
    const lnInvoice = await Wallets.addInvoiceNoAmountForSelf({
      walletId: walletIdBtc,
    })
    if (lnInvoice instanceof Error) throw lnInvoice
    const { paymentRequest: request } = lnInvoice

    const result = await walletInvoices.findByPaymentHash(getHash(request))
    if (result instanceof Error) throw result
    const { walletId, currency } = result
    expect(walletId).toBe(walletIdBtc)
    expect(currency).toBe(WalletCurrency.Btc)
  })

  it("adds a public with amount invoice", async () => {
    const amountInput = 10

    const lnInvoice = await Wallets.addInvoiceForRecipient({
      recipientWalletId: walletIdBtc,
      amount: amountInput,
    })
    if (lnInvoice instanceof Error) throw lnInvoice
    const { paymentRequest: request } = lnInvoice
    expect(request.startsWith("lnbcrt1")).toBeTruthy()

    const result = await walletInvoices.findByPaymentHash(getHash(request))
    if (result instanceof Error) throw result
    const { walletId, selfGenerated } = result
    expect(String(walletId)).toBe(String(walletIdBtc))
    expect(selfGenerated).toBe(false)

    const decodedInvoice = decodeInvoice(request)
    if (decodedInvoice instanceof Error) throw decodedInvoice

    const { amount } = decodedInvoice
    expect(amount).toBe(amountInput)
  })

  it("adds a public no amount invoice", async () => {
    const lnInvoice = await Wallets.addInvoiceNoAmountForRecipient({
      recipientWalletId: walletIdBtc,
    })
    if (lnInvoice instanceof Error) throw lnInvoice
    const { paymentRequest: request } = lnInvoice
    expect(request.startsWith("lnbcrt1")).toBeTruthy()

    const result = await walletInvoices.findByPaymentHash(getHash(request))
    if (result instanceof Error) throw result
    const { walletId, selfGenerated } = result
    expect(String(walletId)).toBe(String(walletIdBtc))
    expect(selfGenerated).toBe(false)
  })
})

describe("Wallet - addInvoice USD", () => {
  it("add a self generated USD invoice", async () => {
    const displayCurrencyPerSat = await getCurrentPrice()
    if (displayCurrencyPerSat instanceof Error) return displayCurrencyPerSat

    const centsInput = 10000

    const centsPerSat = displayCurrencyPerSat * CENTS_PER_USD
    const sats = (centsInput / centsPerSat) * 0.996 // 40 bps spread

    const lnInvoice = await Wallets.addInvoiceForSelf({
      walletId: walletIdUsd,
      amount: centsInput,
    })
    if (lnInvoice instanceof Error) throw lnInvoice
    const { paymentRequest: request } = lnInvoice

    expect(request.startsWith("lnbcrt")).toBeTruthy()
    const result = await walletInvoices.findByPaymentHash(getHash(request))
    if (result instanceof Error) throw result
    const { walletId, cents, currency } = result
    expect(String(walletId)).toBe(String(walletIdUsd))
    expect(cents).toBe(centsInput)
    expect(currency).toBe(WalletCurrency.Usd)

    const decodedInvoice = decodeInvoice(request)
    if (decodedInvoice instanceof Error) throw decodedInvoice

    const { amount } = decodedInvoice
    expect(amount).toBe(sats)
  })

  it("add a self generated invoice without amount", async () => {
    const lnInvoice = await Wallets.addInvoiceNoAmountForSelf({
      walletId: walletIdUsd,
    })
    if (lnInvoice instanceof Error) throw lnInvoice
    const { paymentRequest: request } = lnInvoice

    const result = await walletInvoices.findByPaymentHash(getHash(request))
    if (result instanceof Error) throw result
    const { walletId, cents } = result
    expect(String(walletId)).toBe(String(walletIdUsd))
    expect(cents).toBe(undefined)
  })

  it("adds a public with amount invoice", async () => {
    const displayCurrencyPerSat = await getCurrentPrice()
    if (displayCurrencyPerSat instanceof Error) return displayCurrencyPerSat

    const centsInput = 10000

    const centsPerSat = displayCurrencyPerSat * CENTS_PER_USD
    const sats = (centsInput / centsPerSat) * 0.996 // 40 bps spread

    const lnInvoice = await Wallets.addInvoiceForRecipient({
      recipientWalletId: walletIdUsd,
      amount: centsInput,
    })
    if (lnInvoice instanceof Error) throw lnInvoice
    const { paymentRequest: request } = lnInvoice
    expect(request.startsWith("lnbcrt")).toBeTruthy()

    const result = await walletInvoices.findByPaymentHash(getHash(request))
    if (result instanceof Error) throw result
    const { walletId, selfGenerated, cents } = result
    expect(cents).toBe(centsInput)

    expect(String(walletId)).toBe(String(walletIdUsd))
    expect(selfGenerated).toBe(false)

    const decodedInvoice = decodeInvoice(request)
    if (decodedInvoice instanceof Error) throw decodedInvoice

    const { amount } = decodedInvoice
    expect(amount).toBe(sats)
  })

  it("adds a public invoice", async () => {
    const lnInvoice = await Wallets.addInvoiceNoAmountForRecipient({
      recipientWalletId: walletIdUsd,
    })
    if (lnInvoice instanceof Error) throw lnInvoice
    const { paymentRequest: request } = lnInvoice
    expect(request.startsWith("lnbcrt1")).toBeTruthy()

    const result = await walletInvoices.findByPaymentHash(getHash(request))
    if (result instanceof Error) throw result
    const { walletId, selfGenerated, cents } = result
    expect(String(walletId)).toBe(String(walletIdUsd))
    expect(selfGenerated).toBe(false)
    expect(cents).toBe(undefined)
  })
})

describe("Wallet - rate limiting test", () => {
  it("fails to add invoice past rate limit", async () => {
    // Reset limits before starting
    const resetOk = await resetSelfAccountIdLimits(accountIdB)
    expect(resetOk).not.toBeInstanceOf(Error)
    if (resetOk instanceof Error) throw resetOk

    // Create max number of invoices
    const limitsNum = getInvoiceCreateAttemptLimits().points

    const promises: Promise<LnInvoice | ApplicationError>[] = []
    for (let i = 0; i < limitsNum; i++) {
      const lnInvoicePromise = Wallets.addInvoiceForSelf({
        walletId: walletIdBtc,
        amount: 1000,
      })
      promises.push(lnInvoicePromise)
    }
    const lnInvoices = await Promise.all(promises)
    const isNotError = (item) => !(item instanceof Error)
    expect(lnInvoices.every(isNotError)).toBe(true)

    return testPastSelfInvoiceLimits({ walletId: walletIdBtc, accountId: accountIdB })
  })

  it("fails to add no amount invoice past rate limit", async () => {
    // Reset limits before starting
    const resetOk = await resetSelfAccountIdLimits(accountIdB)
    expect(resetOk).not.toBeInstanceOf(Error)
    if (resetOk instanceof Error) throw resetOk

    // Create max number of invoices
    const limitsNum = getInvoiceCreateAttemptLimits().points
    const promises: Promise<LnInvoice | ApplicationError>[] = []
    for (let i = 0; i < limitsNum; i++) {
      const lnInvoicePromise = Wallets.addInvoiceNoAmountForSelf({
        walletId: walletIdBtc,
      })
      promises.push(lnInvoicePromise)
    }
    const lnInvoices = await Promise.all(promises)
    const isNotError = (item) => !(item instanceof Error)
    expect(lnInvoices.every(isNotError)).toBe(true)

    return testPastSelfInvoiceLimits({ walletId: walletIdBtc, accountId: accountIdB })
  })

  it("fails to add public invoice past rate limit", async () => {
    // Reset limits before starting
    const resetOk = await resetRecipientAccountIdLimits(accountIdB)
    expect(resetOk).not.toBeInstanceOf(Error)
    if (resetOk instanceof Error) throw resetOk

    // Create max number of invoices
    const limitsNum = getInvoiceCreateForRecipientAttemptLimits().points
    const promises: Promise<LnInvoice | ApplicationError>[] = []
    for (let i = 0; i < limitsNum; i++) {
      const lnInvoicePromise = Wallets.addInvoiceForRecipient({
        recipientWalletId: walletIdBtc,
        amount: 1000,
      })
      promises.push(lnInvoicePromise)
    }
    const lnInvoices = await Promise.all(promises)
    const isNotError = (item) => !(item instanceof Error)
    expect(lnInvoices.every(isNotError)).toBe(true)

    return testPastRecipientInvoiceLimits({
      walletId: walletIdBtc,
      accountId: accountIdB,
    })
  })

  it("fails to add no amount public invoice past rate limit", async () => {
    // Reset limits before starting
    const resetOk = await resetRecipientAccountIdLimits(accountIdB)
    expect(resetOk).not.toBeInstanceOf(Error)
    if (resetOk instanceof Error) throw resetOk

    // Create max number of invoices
    const limitsNum = getInvoiceCreateForRecipientAttemptLimits().points
    const promises: Promise<LnInvoice | ApplicationError>[] = []
    for (let i = 0; i < limitsNum; i++) {
      const lnInvoicePromise = Wallets.addInvoiceNoAmountForRecipient({
        recipientWalletId: walletIdBtc,
      })
      promises.push(lnInvoicePromise)
    }
    const lnInvoices = await Promise.all(promises)
    const isNotError = (item) => !(item instanceof Error)
    expect(lnInvoices.every(isNotError)).toBe(true)

    return testPastRecipientInvoiceLimits({
      walletId: walletIdBtc,
      accountId: accountIdB,
    })
  })
})

const testPastSelfInvoiceLimits = async ({
  walletId,
  accountId,
}: {
  walletId: WalletId
  accountId: AccountId
}) => {
  // Test that first invoice past the limit fails
  const lnInvoice = await Wallets.addInvoiceForSelf({
    walletId,
    amount: 1000,
  })
  expect(lnInvoice).toBeInstanceOf(InvoiceCreateRateLimiterExceededError)

  const lnNoAmountInvoice = await Wallets.addInvoiceNoAmountForSelf({
    walletId,
  })
  expect(lnNoAmountInvoice).toBeInstanceOf(InvoiceCreateRateLimiterExceededError)

  // Test that recipient invoices still work
  const lnRecipientInvoice = await Wallets.addInvoiceForRecipient({
    recipientWalletId: walletId,
    amount: 1000,
  })
  expect(lnRecipientInvoice).not.toBeInstanceOf(Error)
  expect(lnRecipientInvoice).toHaveProperty("paymentRequest")

  const lnNoAmountRecipientInvoice = await Wallets.addInvoiceNoAmountForRecipient({
    recipientWalletId: walletId,
  })
  expect(lnNoAmountRecipientInvoice).not.toBeInstanceOf(Error)
  expect(lnNoAmountRecipientInvoice).toHaveProperty("paymentRequest")

  // Reset limits when done for other tests
  let resetOk = await resetSelfAccountIdLimits(accountId)
  expect(resetOk).not.toBeInstanceOf(Error)
  resetOk = await resetRecipientAccountIdLimits(accountId)
  expect(resetOk).not.toBeInstanceOf(Error)
}

const testPastRecipientInvoiceLimits = async ({
  walletId,
  accountId,
}: {
  walletId: WalletId
  accountId: AccountId
}) => {
  // Test that first invoice past the limit fails
  const lnRecipientInvoice = await Wallets.addInvoiceForRecipient({
    recipientWalletId: walletId,
    amount: 1000,
  })
  expect(lnRecipientInvoice).toBeInstanceOf(
    InvoiceCreateForRecipientRateLimiterExceededError,
  )

  const lnNoAmountRecipientInvoice = await Wallets.addInvoiceNoAmountForRecipient({
    recipientWalletId: walletId,
  })
  expect(lnNoAmountRecipientInvoice).toBeInstanceOf(
    InvoiceCreateForRecipientRateLimiterExceededError,
  )

  // Test that recipient invoices still work
  const lnInvoice = await Wallets.addInvoiceForSelf({
    walletId,
    amount: 1000,
  })
  expect(lnInvoice).not.toBeInstanceOf(Error)
  expect(lnInvoice).toHaveProperty("paymentRequest")

  const lnNoAmountInvoice = await Wallets.addInvoiceNoAmountForSelf({
    walletId,
  })
  expect(lnNoAmountInvoice).not.toBeInstanceOf(Error)
  expect(lnNoAmountInvoice).toHaveProperty("paymentRequest")

  // Reset limits when done for other tests
  let resetOk = await resetSelfAccountIdLimits(accountId)
  expect(resetOk).not.toBeInstanceOf(Error)
  resetOk = await resetRecipientAccountIdLimits(accountId)
  expect(resetOk).not.toBeInstanceOf(Error)
}
