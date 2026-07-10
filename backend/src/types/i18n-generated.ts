// FILE INI DI-GENERATE OTOMATIS OLEH scripts/generate-i18n-types.ts
// JANGAN DIEDIT SECARA MANUAL.

/**
 * Union type dari semua path yang tersedia di kamus i18n.
 */
export type TranslationKey =
  | "common.unauthorized"
  | "common.forbidden"
  | "common.notFound"
  | "common.badRequest"
  | "common.internalServerError"
  | "common.validationError"
  | "common.invalidId"
  | "common.duplicateData"
  | "common.foreignKeyViolation"
  | "common.dbNotFound"
  | "auth.loginSuccess"
  | "auth.invalidCredentials"
  | "auth.userNotFound"
  | "auth.profileSuccess"
  | "auth.unauthenticated"
  | "user.findAllSuccess"
  | "user.createSuccess"
  | "user.updateSuccess"
  | "user.deleteSuccess"
  | "user.notFound"
  | "user.invalidId"
  | "user.nisAlreadyUsed"
  | "user.emailAlreadyUsed"
  | "user.nisAlreadyUsedByOther"
  | "user.emailAlreadyUsedByOther"
  | "user.selfDemotionForbidden"
  | "user.selfDeletionForbidden"
  | "user.hasActiveLoan"
  | "user.hasLoanHistory"
  | "user.changePasswordSuccess"
  | "user.resetPasswordSuccess"
  | "user.selfResetForbidden"
  | "user.wrongOldPassword"
  | "user.samePasswordForbidden"
  | "user.importFileRequired"
  | "user.importNoSheet"
  | "user.importReadFailed"
  | "user.importFileEmpty"
  | "user.importValidationFailed"
  | "user.importSuccess"
  | "user.importPartialSkipped"
  | "user.importPartialFailed"
  | "book.findAllSuccess"
  | "book.findOneSuccess"
  | "book.createSuccess"
  | "book.updateSuccess"
  | "book.deleteSuccess"
  | "book.notFound"
  | "book.invalidId"
  | "book.isbnAlreadyUsed"
  | "book.stockEmpty"
  | "category.findAllSuccess"
  | "category.findOneSuccess"
  | "category.createSuccess"
  | "category.updateSuccess"
  | "category.deleteSuccess"
  | "category.notFound"
  | "category.invalidId"
  | "category.alreadyExists"
  | "loan.memberOnly"
  | "loan.overdueBlock"
  | "loan.limitReached"
  | "loan.duplicateLoan"
  | "loan.stockEmpty"
  | "loan.approveStockEmpty"
  | "loan.invalidStatus"
  | "loan.invalidId"
  | "loan.notFound"
  | "loan.alreadyProcessed"
  | "loan.alreadyProcessedApprove"
  | "loan.alreadyProcessedReject"
  | "loan.mustBeApproved"
  | "loan.findAllSuccess"
  | "loan.findMyLoansSuccess"
  | "loan.createSuccess"
  | "loan.approveSuccess"
  | "loan.rejectSuccess"
  | "loan.returnSuccess"
  | "dashboard.statsSuccess"
  | "dashboard.myStatsSuccess"
  | "dashboard.unauthenticated"
  | "validation.required"
  | "validation.invalidFormat"
  | "validation.tooSmall"
  | "validation.tooBig"
  | "validation.invalidType"
  | "validation.invalidEnumValue";

/**
 * Tipe parameter wajib berdasarkan placeholder yang ada pada kamus terjemahan.
 */
export type TranslationParams<K extends TranslationKey> =
  K extends "common.unauthorized" ? Record<never, string | number>
  :   K extends "common.forbidden" ? Record<never, string | number>
  :   K extends "common.notFound" ? Record<never, string | number>
  :   K extends "common.badRequest" ? Record<never, string | number>
  :   K extends "common.internalServerError" ? Record<never, string | number>
  :   K extends "common.validationError" ? Record<never, string | number>
  :   K extends "common.invalidId" ? Record<never, string | number>
  :   K extends "common.duplicateData" ? Record<"field", string | number>
  :   K extends "common.foreignKeyViolation" ? Record<never, string | number>
  :   K extends "common.dbNotFound" ? Record<never, string | number>
  :   K extends "auth.loginSuccess" ? Record<never, string | number>
  :   K extends "auth.invalidCredentials" ? Record<never, string | number>
  :   K extends "auth.userNotFound" ? Record<never, string | number>
  :   K extends "auth.profileSuccess" ? Record<never, string | number>
  :   K extends "auth.unauthenticated" ? Record<never, string | number>
  :   K extends "user.findAllSuccess" ? Record<never, string | number>
  :   K extends "user.createSuccess" ? Record<never, string | number>
  :   K extends "user.updateSuccess" ? Record<never, string | number>
  :   K extends "user.deleteSuccess" ? Record<never, string | number>
  :   K extends "user.notFound" ? Record<never, string | number>
  :   K extends "user.invalidId" ? Record<never, string | number>
  :   K extends "user.nisAlreadyUsed" ? Record<never, string | number>
  :   K extends "user.emailAlreadyUsed" ? Record<never, string | number>
  :   K extends "user.nisAlreadyUsedByOther" ? Record<never, string | number>
  :   K extends "user.emailAlreadyUsedByOther" ? Record<never, string | number>
  :   K extends "user.selfDemotionForbidden" ? Record<never, string | number>
  :   K extends "user.selfDeletionForbidden" ? Record<never, string | number>
  :   K extends "user.hasActiveLoan" ? Record<never, string | number>
  :   K extends "user.hasLoanHistory" ? Record<never, string | number>
  :   K extends "user.changePasswordSuccess" ? Record<never, string | number>
  :   K extends "user.resetPasswordSuccess" ? Record<never, string | number>
  :   K extends "user.selfResetForbidden" ? Record<never, string | number>
  :   K extends "user.wrongOldPassword" ? Record<never, string | number>
  :   K extends "user.samePasswordForbidden" ? Record<never, string | number>
  :   K extends "user.importFileRequired" ? Record<never, string | number>
  :   K extends "user.importNoSheet" ? Record<never, string | number>
  :   K extends "user.importReadFailed" ? Record<never, string | number>
  :   K extends "user.importFileEmpty" ? Record<never, string | number>
  :   K extends "user.importValidationFailed" ? Record<never, string | number>
  :   K extends "user.importSuccess" ? Record<never, string | number>
  :   K extends "user.importPartialSkipped" ? Record<"count", string | number>
  :   K extends "user.importPartialFailed" ? Record<never, string | number>
  :   K extends "book.findAllSuccess" ? Record<never, string | number>
  :   K extends "book.findOneSuccess" ? Record<never, string | number>
  :   K extends "book.createSuccess" ? Record<never, string | number>
  :   K extends "book.updateSuccess" ? Record<never, string | number>
  :   K extends "book.deleteSuccess" ? Record<never, string | number>
  :   K extends "book.notFound" ? Record<never, string | number>
  :   K extends "book.invalidId" ? Record<never, string | number>
  :   K extends "book.isbnAlreadyUsed" ? Record<never, string | number>
  :   K extends "book.stockEmpty" ? Record<never, string | number>
  :   K extends "category.findAllSuccess" ? Record<never, string | number>
  :   K extends "category.findOneSuccess" ? Record<never, string | number>
  :   K extends "category.createSuccess" ? Record<never, string | number>
  :   K extends "category.updateSuccess" ? Record<never, string | number>
  :   K extends "category.deleteSuccess" ? Record<never, string | number>
  :   K extends "category.notFound" ? Record<never, string | number>
  :   K extends "category.invalidId" ? Record<never, string | number>
  :   K extends "category.alreadyExists" ? Record<never, string | number>
  :   K extends "loan.memberOnly" ? Record<never, string | number>
  :   K extends "loan.overdueBlock" ? Record<never, string | number>
  :   K extends "loan.limitReached" ? Record<"limit", string | number>
  :   K extends "loan.duplicateLoan" ? Record<never, string | number>
  :   K extends "loan.stockEmpty" ? Record<never, string | number>
  :   K extends "loan.approveStockEmpty" ? Record<never, string | number>
  :   K extends "loan.invalidStatus" ? Record<never, string | number>
  :   K extends "loan.invalidId" ? Record<never, string | number>
  :   K extends "loan.notFound" ? Record<never, string | number>
  :   K extends "loan.alreadyProcessed" ? Record<never, string | number>
  :   K extends "loan.alreadyProcessedApprove" ? Record<never, string | number>
  :   K extends "loan.alreadyProcessedReject" ? Record<never, string | number>
  :   K extends "loan.mustBeApproved" ? Record<never, string | number>
  :   K extends "loan.findAllSuccess" ? Record<never, string | number>
  :   K extends "loan.findMyLoansSuccess" ? Record<never, string | number>
  :   K extends "loan.createSuccess" ? Record<never, string | number>
  :   K extends "loan.approveSuccess" ? Record<never, string | number>
  :   K extends "loan.rejectSuccess" ? Record<never, string | number>
  :   K extends "loan.returnSuccess" ? Record<never, string | number>
  :   K extends "dashboard.statsSuccess" ? Record<never, string | number>
  :   K extends "dashboard.myStatsSuccess" ? Record<never, string | number>
  :   K extends "dashboard.unauthenticated" ? Record<never, string | number>
  :   K extends "validation.required" ? Record<"field", string | number>
  :   K extends "validation.invalidFormat" ? Record<"field", string | number>
  :   K extends "validation.tooSmall" ? Record<"field" | "limit", string | number>
  :   K extends "validation.tooBig" ? Record<"field" | "limit", string | number>
  :   K extends "validation.invalidType" ? Record<"expected" | "received", string | number>
  :   K extends "validation.invalidEnumValue" ? Record<"options", string | number>
  : never;
