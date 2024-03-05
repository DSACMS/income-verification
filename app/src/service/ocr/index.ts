import { createLogger } from "@/service/factory";
import { type ParserKeys, parseOcrResult, parsers } from "@/service/ocr/parser";
import { DocumentImage, rotateDocumentImage } from "@/utils/document";
import { createWorker } from "tesseract.js";

export type DocumentMatcher<
  K extends ParserKeys | string,
  P extends Record<string, RegExp> = Record<string, RegExp>
> = {
  name: string;
  id: K;
  patterns: P;
};

export type OcrOptions = {
  debug: boolean;
};

export type ProcessedImageResult = {
  documents: ReturnType<typeof parseOcrResult>;
  image: DocumentImage;
  percentages: Record<ParserKeys, number>;
};

// main logger
export const logger = createLogger("ocr-parser", {
  enabled: false,
  mixin: () => {
    return { module: "ocr-parser" };
  },
});

const getTextFromImagePath = async (
  document: DocumentImage,
  opts: OcrOptions
) => {
  const worker = await createWorker("eng", 1, {
    logger: opts.debug ? (message) => logger.debug(message) : undefined,
  });
  const result = await worker.recognize(document.sourcePath);
  const output = result.data.text;
  await worker.terminate();

  return output;
};

const process = async (
  document: DocumentImage
): Promise<ProcessedImageResult> => {
  const orientation = document.textOrientation;
  if (orientation !== "0") {
    document = await rotateDocumentImage(document);
  }

  const text = await getTextFromImagePath(document, { debug: true });
  const parsersArray = Object.values(parsers);
  const docs = parseOcrResult(text, parsersArray, logger);

  // let's keep track of the number of matched fields per parser
  const percentages: Record<string, number> = {};

  parsersArray.forEach((parser) => {
    const docResults = docs[parser.id];
    const totalFields = Object.keys(parser.patterns).length;
    let matchedFields = 0;

    if (docResults) {
      Object.keys(parser.patterns).forEach((field) => {
        if (docResults[field]) {
          matchedFields++;
        }
      });
    }
    const percentageRounded = Math.round((matchedFields / totalFields) * 100);
    percentages[parser.id] = percentageRounded;
  });

  const result = {
    documents: docs,
    image: document,
    percentages,
  };

  return result;
};

const ocrService = {
  process,
  logger,
  getTextFromImagePath,
};

export default ocrService;
