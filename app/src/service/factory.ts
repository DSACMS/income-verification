import pino, { DestinationStream, LoggerOptions } from "pino";
import sharp from "sharp";
import path from "path";
import { DocumentImage } from "@/utils/document";
import { DocumentMatcher } from "@/service/ocr";

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
}

export const createDocumentImage = async (imagePath: string): Promise<DocumentImage> => {
    const image = sharp(imagePath);
    const data = await image.toBuffer();
    const fileName = path.parse(imagePath).name;
    const metaData = await image.metadata();
    
    return {
        data,
        fileName,
        sourcePath: imagePath,
        textOrientation: '0',
        metaData,
    };
};