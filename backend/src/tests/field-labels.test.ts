import { describe, it, expect } from "vitest";
import { fieldLabels } from "../utils/i18n.js";
import * as authValidation from "../validations/auth.validation.js";
import * as bookValidation from "../validations/book.validation.js";
import * as categoryValidation from "../validations/category.validation.js";
import * as loanValidation from "../validations/loan.validation.js";
import * as userValidation from "../validations/user.validation.js";

describe("Guardrail Validasi Field Labels", () => {
  it("semua field yang digunakan di Zod schema wajib memiliki label di fieldLabels", () => {
    const schemas: any[] = [
      ...Object.values(authValidation),
      ...Object.values(bookValidation),
      ...Object.values(categoryValidation),
      ...Object.values(loanValidation),
      ...Object.values(userValidation),
    ];

    const missingLabels = new Set<string>();

    const checkShape = (shape: Record<string, any>) => {
      Object.keys(shape).forEach((key) => {
        if (!fieldLabels[key]) {
          missingLabels.add(key);
        }
      });
    };

    schemas.forEach((schema) => {
      if (schema && typeof schema === "object") {
        if ("shape" in schema && typeof schema.shape === "object") {
          checkShape(schema.shape);
        } else if ("innerType" in schema && typeof schema.innerType === "function") {
          const inner = schema.innerType();
          if (inner && typeof inner === "object" && "shape" in inner) {
            checkShape(inner.shape);
          }
        }
      }
    });

    if (missingLabels.size > 0) {
      expect.fail(
        `[Guardrail] Kolom berikut digunakan di Zod validasi tapi BELUM terdaftar di fieldLabels (src/utils/i18n.ts):\n` +
          Array.from(missingLabels)
            .map((f) => `  - "${f}"`)
            .join("\n") +
          `\nSilakan tambahkan label terjemahan (ID/EN) untuk kolom-kolom di atas agar pesan error validasi rapi!`
      );
    }
  });
});
