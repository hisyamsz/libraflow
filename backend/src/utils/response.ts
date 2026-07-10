import type { Response } from "express";
import { ZodError } from "zod";
import { translate, type TranslationKey, type TranslationParams } from "./i18n.js";
import { globalErrorHandler } from "../middlewares/error.middleware.js";

type Pagination = {
  current: number;
  total: number;
  totalPage: number;
};

type Meta = {
  status: number;
  message: string;
};

/**
 * Mengambil kode bahasa dari request yang terlampir di response object.
 * Express menyimpan referensi ke `req` di dalam objek `res`, sehingga kita
 * tidak perlu mengoper `req` secara eksplisit ke setiap fungsi response.
 */
const getLang = (res: Response): "id" | "en" => {
  return (res.req as any)?.lang ?? "id";
};

/**
 * Utilitas standar untuk mengirimkan respons HTTP yang konsisten.
 *
 * Parameter `messageKey` menerima dua format:
 * 1. Translation key (contoh: "auth.loginSuccess") → akan diterjemahkan sesuai bahasa.
 * 2. Teks biasa (contoh: "Berhasil") → dikembalikan apa adanya (safe fallback).
 */
export default {
  /**
   * 200 OK — Operasi berhasil
   */
  success<K extends TranslationKey>(
    res: Response,
    data: any,
    messageKey: K | (string & {}) = "common.success" as K,
    params?: TranslationParams<K>,
  ) {
    const lang = getLang(res);
    const message = translate(messageKey, lang, params);

    return res.status(200).json({
      meta: { status: 200, message } as Meta,
      data,
    });
  },

  /**
   * 201 Created — Resource baru berhasil dibuat
   */
  created<K extends TranslationKey>(
    res: Response,
    data: any,
    messageKey: K | (string & {}) = "common.created" as K,
    params?: TranslationParams<K>,
  ) {
    const lang = getLang(res);
    const message = translate(messageKey, lang, params);

    return res.status(201).json({
      meta: { status: 201, message } as Meta,
      data,
    });
  },

  /**
   * 404 Not Found — Resource tidak ditemukan
   */
  notFound<K extends TranslationKey>(
    res: Response,
    messageKey: K | (string & {}) = "common.notFound" as K,
    data: any = null,
    params?: TranslationParams<K>,
  ) {
    const lang = getLang(res);
    const message = translate(messageKey, lang, params);

    return res.status(404).json({
      meta: { status: 404, message } as Meta,
      data,
    });
  },

  /**
   * 400 Bad Request — Input tidak valid atau melanggar aturan bisnis
   */
  badRequest<K extends TranslationKey>(
    res: Response,
    messageKey: K | (string & {}) = "common.badRequest" as K,
    data: any = null,
    params?: TranslationParams<K>,
  ) {
    const lang = getLang(res);
    const message = translate(messageKey, lang, params);

    return res.status(400).json({
      meta: { status: 400, message } as Meta,
      data,
    });
  },

  /**
   * 401 Unauthorized — Belum terautentikasi
   */
  unauthorized<K extends TranslationKey>(
    res: Response,
    messageKey: K | (string & {}) = "common.unauthorized" as K,
    data: any = null,
    params?: TranslationParams<K>,
  ) {
    const lang = getLang(res);
    const message = translate(messageKey, lang, params);

    return res.status(401).json({
      meta: { status: 401, message } as Meta,
      data,
    });
  },

  /**
   * 403 Forbidden — Terautentikasi tapi tidak punya izin
   */
  forbidden<K extends TranslationKey>(
    res: Response,
    messageKey: K | (string & {}) = "common.forbidden" as K,
    data: any = null,
    params?: TranslationParams<K>,
  ) {
    const lang = getLang(res);
    const message = translate(messageKey, lang, params);

    return res.status(403).json({
      meta: { status: 403, message } as Meta,
      data,
    });
  },

  /**
   * 200 OK — Response dengan data paginasi
   */
  pagination<K extends TranslationKey>(
    res: Response,
    data: any[],
    pagination: Pagination,
    messageKey: K | (string & {}) = "common.success" as K,
    params?: TranslationParams<K>,
  ) {
    const lang = getLang(res);
    const message = translate(messageKey, lang, params);

    return res.status(200).json({
      meta: { status: 200, message } as Meta,
      data,
      pagination,
    });
  },

  /**
   * Mengirimkan error response dari handler internal (jarang dipakai langsung;
   * sebagian besar error ditangani oleh globalErrorHandler middleware).
   */
  error<K extends TranslationKey>(
    res: Response,
    error: unknown,
    messageKey: K | (string & {}) = "common.internalServerError" as K,
  ) {
    const lang = getLang(res);

    // Delegasikan langsung ke globalErrorHandler untuk standardisasi respons penuh!
    if (error instanceof ZodError || (error as any)?.code?.startsWith?.("P")) {
      const dummyNext = () => {};
      return globalErrorHandler(error, res.req as any, res, dummyNext);
    }

    // NULL / UNDEFINED
    if (error === null || error === undefined) {
      return res.status(400).json({
        meta: {
          status: 400,
          message: translate(messageKey, lang),
        } as Meta,
        data: null,
      });
    }

    // GENERIC ERROR
    return res.status(500).json({
      meta: {
        status: 500,
        message: translate(messageKey, lang),
      } as Meta,
      data: error,
    });
  },
};
