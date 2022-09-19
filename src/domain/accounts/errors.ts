import { DomainError } from "@domain/shared"

export class AccountError extends DomainError {}

export class UsernameNotAvailableError extends AccountError {}
export class UsernameIsImmutableError extends AccountError {}

export class AccountCustomFieldsError extends DomainError {}

export class InvalidCustomFieldError extends AccountCustomFieldsError {}
export class NoAccountCustomFieldsError extends AccountCustomFieldsError {}
export class AccountCustomFieldsUpdateError extends AccountCustomFieldsError {}
export class AccountCustomFieldsSetOnlyOnceError extends AccountCustomFieldsError {}
