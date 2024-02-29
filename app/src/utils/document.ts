import sharp from "sharp";
import path from "path";

export type DocumentImage = {
    data: Buffer;
    fileName: string;
    source: string;
    metaData: sharp.Metadata;
    orientation: '0' | '90' | '180' | '270'
}

/**
 * calculates the index of the next orientation by adding 1 to the current index
 * and taking the modulo 4 to ensure that the index wraps around to the beginning
 * of the array if it exceeds the array length.
 * @param image 
 * @returns 
 */
export const rotateImage = async (image: DocumentImage): Promise<DocumentImage> => {
    const orientations: ('0' | '90' | '180' | '270')[] = ['0', '90', '180', '270'];
    const index = orientations.indexOf(image.orientation);
    const nextIndex = (index + 1) % 4;
    const rotatedImageData = await sharp(image.data)
        .rotate(90)
        .toBuffer();

    return {
        ...image,
        orientation: orientations[nextIndex],
        data: rotatedImageData,
    };
};

/**
 * a function to create a DocumentImage object from a file path
 */
export const createDocumentImage = async (imagePath: string): Promise<DocumentImage> => {
    const image = sharp(imagePath);
    const data = await image.toBuffer();
    const fileName = path.parse(imagePath).name as string;
    const metaData = await image.metadata();
    
    return {
        data,
        fileName,
        source: imagePath,
        orientation: '0',
        metaData,
    };
};