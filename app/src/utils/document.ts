import sharp from "sharp";
import Tesseract from "tesseract.js";

export type DocumentOrientation = 0 | 90 | 180 | 270;

export const orientations: DocumentOrientation[] = [0, 90, 180, 270];

export type DocumentImage = {
  data: Buffer;
  fileName: string;
  sourcePath: string;
  metaData: sharp.Metadata;
  textOrientation: DocumentOrientation;
};

/**
 * calculates the index of the next orientation by adding 1 to the current index
 * and taking the modulo 4 to ensure that the index wraps around to the beginning
 * of the array if it exceeds the array length.
 * @param image
 * @returns
 */
export const rotateDocumentImage = async (
  image: DocumentImage,
  rotateBy: DocumentOrientation = 90
): Promise<DocumentImage> => {
  const index = orientations.indexOf(image.textOrientation);
  const nextIndex = (index + 1) % 4;
  const nextOrientation = orientations[nextIndex];

  const rotatedImageData = await sharp(image.data).rotate(rotateBy).toBuffer();

  return {
    ...image,
    textOrientation: nextOrientation,
    data: rotatedImageData,
  };
};

export const getTextFromDocumentImage = async (
  worker: Tesseract.Worker,
  document: DocumentImage
) => {
  const result = await worker.recognize(document.data);
  const output = {
    text: result.data.text,
    confidence: result.data.confidence,
  };
  return output;
};
