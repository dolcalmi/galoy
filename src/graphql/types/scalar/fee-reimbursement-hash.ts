import { InputValidationError } from "@graphql/error"
import { GT } from "@graphql/index"

const FeeReimbursementHash = GT.Scalar({
  name: "FeeReimbursementHash",
  description: "A LN hash used for fee reimbursement",
  parseValue(value) {
    return validFeeReimbursementHashValue(value)
  },
  parseLiteral(ast) {
    if (ast.kind === GT.Kind.STRING) {
      return validFeeReimbursementHashValue(ast.value)
    }
    return new InputValidationError({ message: "Invalid type for FeeReimbursementHash" })
  },
})

function validFeeReimbursementHashValue(value) {
  // TODO: verify/improve.
  if (value.match(/^[A-Fa-f0-9]+$/i)) {
    return value.toLowerCase()
  }
  return new InputValidationError({ message: "Invalid value for FeeReimbursementHash" })
}

export default FeeReimbursementHash
