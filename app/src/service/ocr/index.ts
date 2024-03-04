import { createWorker } from "tesseract.js";
import { createLogger } from "@/utils/logger";
import { DocumentImage, rotateDocumentImage } from "@/utils/document";
import { parseOcrResult, parsers } from "@/service/ocr/parser";

export type DocumentMatcher<P extends Record<string, RegExp>> = {
  name: string;
  id: 'w2' | 'adpEarningsStatement';
  patterns: P;
};

export type OcrOptions = {
  debug: boolean;
};

// main logger
export const logger = createLogger("ocr-parser", {
  enabled: process.env.LOG_LEVEL === "debug",
  mixin: () => {
    return { module: "ocr-parser" };
  },
});

const getTextFromImagePath = async (document: DocumentImage, opts: OcrOptions) => {
  const worker = await createWorker("eng", 1, {
    logger: opts.debug ? (message) => logger.debug(message) : undefined,
  });
  const result = await worker.recognize(document.sourcePath);
  const output = result.data.text;
  await worker.terminate();

  return output;
};

const process = async (document:DocumentImage) => {
  const orientation = document.orientation;
  if(orientation !== '0'){
    document = await rotateDocumentImage(document);
  }

  const text = await getTextFromImagePath(document, { debug: true });
  const parsersArray = Object.values(parsers);
  const result = parseOcrResult(text, parsersArray, logger);

  return result;
};

const ocrService = {
  process,
  logger,
  getTextFromImagePath
};

export default ocrService;
