import { createWorker } from "tesseract.js";
import { createLogger } from "@/utils/logger";
import * as parsers from "./parser";
import { type AdpEarningStatementPatterns } from "./document/adpEarningsStatement";
import { type W2StatementPatterns } from "./document/w2";

export type OcrOptions = {
  debug: boolean;
};

export type OCR_Patterns = AdpEarningStatementPatterns | W2StatementPatterns;

// main logger
export const logger = createLogger("ocr-parser", {
  enabled: process.env.LOG_LEVEL === "debug",
  mixin: () => {
    return { module: "ocr-parser" };
  },
});

const scanImage = async (path: string, opts: OcrOptions) => {
  const worker = await createWorker("eng", 1, {
    logger: opts.debug ? (message) => logger.debug(message) : undefined,
  });
  const result = await worker.recognize(path);
  const output = result.data.text;
  await worker.terminate();

  return output;
};

const ocrService = {
  parsers,
  logger,
  scanImage,
};

export default ocrService;
