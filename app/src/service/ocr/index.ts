import { createLogger } from "@/service/factory";
import { type ParserKeys, parseOcrResult, parsers } from "@/service/ocr/parser";
import {
  DocumentImage,
  DocumentOrientation,
  orientations,
  rotateDocumentImage,
} from "@/utils/document";
import { createWorker } from "tesseract.js";

export type DocumentMatcher<
  K extends ParserKeys,
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
  confidence: number;
  rotatedOrientation?: DocumentOrientation;
};

export type ProcessedRotatedImagesResult = ProcessedImageResult[];

export type TextFromImagePathResult = {
  text: string;
  confidence: number;
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

  const result = await worker.recognize(document.data, {
    rotateAuto: true,
  });

  const output = {
    text: result.data.text,
    confidence: result.data.confidence,
  };

  await worker.terminate();

  return output;
};

// a function that rotates an image and processes it for each orientation
const processDocument = async (
  document: DocumentImage
): Promise<ProcessedRotatedImagesResult> => {
  const processImage = async (
    orientation: DocumentOrientation
  ): Promise<ProcessedImageResult> => {
    const rotatedDocumentImage = await rotateDocumentImage(
      document,
      orientation
    );
    const result = await process(rotatedDocumentImage);
    result.rotatedOrientation = orientation;

    return result;
  };

  // Map each orientation to a processing function that returns a promise.
  const promises = orientations.map((orientation) => processImage(orientation));
  const rotated = await Promise.all(promises);

  return rotated;
};

const process = async (
  document: DocumentImage
): Promise<ProcessedImageResult> => {
  const { text, confidence } = await getTextFromImagePath(document, {
    debug: true,
  });
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
    image: document,
    documents: docs,
    percentages,
    confidence,
  };

  return result;
};

const ocrService = {
  process,
  processDocument,
  logger,
  getTextFromImagePath,
};

export default ocrService;
