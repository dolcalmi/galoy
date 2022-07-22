import { IFilterQuery, IPaginationQuery } from "medici"

import { toObjectId } from "@services/mongoose/utils"

import { Transaction } from "./schema"

export const limitFilter = async({ count, first, last, before, after }: PaginationQuery & { count: number }) => {
  const filter = {}

  if (before) {
    const beforeObject = await Transaction.findOne({ _id: toObjectId(before) })
    if (beforeObject) {
      filter["datetime"]["$gt"] = beforeObject.datetime
    }
  }

  if (after) {
    const afterObject = await Transaction.findOne({ _id: toObjectId(after) })
    if (afterObject) {
      filter["datetime"]["$lt"] = afterObject.datetime
    }
  }

  if (first || last) {
    let limit = count
    let skip = 0

    if (first && limit > first) {
      limit = first
    }

    if (last && limit > last) {
      skip = limit - last
      limit = limit - skip
    }

    filter["page"] = skip / limit
    filter["perPage"] = limit
  }

}
