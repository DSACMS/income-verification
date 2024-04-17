import { DocumentMatcher } from "@/service/ocr";
import { DocumentImage, type DocumentOrientation } from "@/utils/document";
import path from "path";
import pino, { DestinationStream, LoggerOptions } from "pino";
import "pino-pretty";
import sharp from "sharp";
import { createWorker } from "tesseract.js";

export const createLogger = (
  name: string,
  opts?: DestinationStream | LoggerOptions<never> | undefined
) => {
  return pino({
    transport: {
      target: "pino-pretty",
    },
    name,
    level: process.env.LOG_LEVEL || "info",
    ...opts,
  });
};

export const createDocumentMatcher = <K extends string>(
  name: string,
  id: K,
  patterns: Record<string, RegExp>
): DocumentMatcher<K, typeof patterns> => {
  return {
    name,
    id,
    patterns,
  };
};

export const createDocumentImage = async (
  imagePath: string,
  textOrientation: DocumentOrientation = 0
): Promise<DocumentImage> => {
  const image = sharp(imagePath);
  const data = await image.toBuffer();
  const fileName = path.parse(imagePath).name;
  const metaData = await image.metadata();

  return {
    data,
    fileName,
    sourcePath: imagePath,
    textOrientation: textOrientation,
    metaData,
  };
};

export const createOcrScanner = async (
  logger: pino.Logger,
  trainingDataPath: string
): Promise<Tesseract.Worker> => {
  const worker = await createWorker("eng", 1, {
    cachePath: trainingDataPath,
    logger: (message) => logger.debug(message),
  });

  return worker;
};
