import { createLogger, createOcrScanner } from "@/service/factories";
import { type ParserKeys, parse, parsers } from "@/service/ocr/parser";
import {
  DocumentImage,
  DocumentOrientation,
  getTextFromDocumentImage,
  rotateDocumentImage,
} from "@/utils/document";
import fs from "fs";
import path from "path";
import Tesseract from "tesseract.js";

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
  logger: ReturnType<typeof createLogger>;
};

export type ProcessedImageResult = {
  documents: ReturnType<typeof parse>;
  image?: DocumentImage;
  fileName: string;
  percentages: Record<ParserKeys, number>;
  confidence: number;
  rotatedOrientation?: DocumentOrientation;
};

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

// a function that rotates an image and processes it for each orientation
export const processDocument = async (
  document: DocumentImage
): Promise<ProcessedImageResult[]> => {
  // get the current working directory
  const trainingDataDir = path.join(process.cwd(), "assets");
  console.log("trainingDataDir", trainingDataDir);

  // log all of the file names in the training data directory
  fs.readdirSync(trainingDataDir).forEach((file) => {
    logger.info(`Training data file: ${file}`);
  });

  const ocrScanner = await createOcrScanner(logger, trainingDataDir);
  const scanned = await scan(ocrScanner, document);

  return [scanned];
  // Map each orientation to a processing function that returns a promise.
  // const promises = orientations.map((orientation) => rotateAndScan(ocrScanner, document, orientation));
  // const rotated = await Promise.all(promises);
  // await ocrScanner.terminate();
  // return rotated;
};

/**
 * Process a single orientation
 * @param worker Tesseract.Worker
 * @param orientation DocumentOrientation
 * @returns ProcessedImageResult
 */
export const rotateAndScan = async (
  worker: Tesseract.Worker,
  document: DocumentImage,
  orientation: DocumentOrientation
): Promise<ProcessedImageResult> => {
  // rotate image to the target orientation
  const rotatedDocumentImage = await rotateDocumentImage(document, orientation);

  const result = await scan(worker, rotatedDocumentImage);
  result.rotatedOrientation = orientation;

  return result;
};

export const scan = async (
  worker: Tesseract.Worker,
  document: DocumentImage
): Promise<ProcessedImageResult> => {
  const { text, confidence } = await getTextFromDocumentImage(worker, document);
  const parsersArray = Object.values(parsers);
  const docs = parse(text, parsersArray, logger);

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
    fileName: document.fileName,
    documents: docs,
    percentages,
    confidence,
  };

  return result;
};

const ocrService = {
  scan,
  rotateAndScan,
  processDocument,
  logger,
};

export default ocrService;
