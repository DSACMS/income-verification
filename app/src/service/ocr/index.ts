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


// a function that rotates an image and processes it for each orientation
const processRotatedImages = async (
  document: DocumentImage,
): Promise< Record<number, ProcessedImageResult>> => {
  const orientations = [0, 90, 180, 270];
  const results: Record<number, ProcessedImageResult> = {
    0: {} as ProcessedImageResult,
    90: {} as ProcessedImageResult,
    180: {} as ProcessedImageResult,
    270: {} as ProcessedImageResult,
  };

  for (const orientation of orientations) {
    const rotatedImage = await rotateDocumentImage(document);
    results[orientation] = await process(rotatedImage);
  }
    
  return results;
};

const process = async (
  document: DocumentImage
): Promise<ProcessedImageResult> => {
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
  processRotatedImages,
  logger,
  getTextFromImagePath,
};

export default ocrService;
