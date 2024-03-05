import { createWorker } from "tesseract.js";
import { createLogger } from "@/service/factory";
import { DocumentImage, rotateDocumentImage } from "@/utils/document";
import { type ParserKeys, parseOcrResult, parsers } from "@/service/ocr/parser";

export type DocumentMatcher<K extends ParserKeys | string = string, P extends Record<string, RegExp> = Record<string, RegExp>> = {
  name: string;
  id: K;
  patterns: P;
};

export type OcrOptions = {
  debug: boolean;
};

// main logger
export const logger = createLogger("ocr-parser", {
  enabled: false,
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
  const orientation = document.textOrientation;
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
