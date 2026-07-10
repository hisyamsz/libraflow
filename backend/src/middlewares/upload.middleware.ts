import multer from "multer";

// Simpan file sementara di memori buffer (tidak di-save di disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas maksimal ukuran file: 5MB
  },
  fileFilter: (_req, file, cb) => {
    // Pastikan format file adalah Excel (.xlsx atau .xls)
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Format file harus berupa Excel (.xlsx atau .xls)"));
    }
  },
});

import type { Request, Response, NextFunction } from "express";
import response from "../utils/response.js";

// Wrapper middleware untuk menangani error upload secara anggun
export const uploadExcel = (req: Request, res: Response, next: NextFunction) => {
  upload.single("file")(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return response.error(res, null, "Ukuran file Excel maksimal adalah 5MB");
      }
      return response.error(res, null, `Multer error: ${err.message}`);
    } else if (err) {
      return response.error(res, null, err.message);
    }
    next();
  });
};
