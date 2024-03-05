import sharp from "sharp";

export type DocumentImage = {
    data: Buffer;
    fileName: string;
    sourcePath: string;
    metaData: sharp.Metadata;
    textOrientation: '0' | '90' | '180' | '270'
}

/**
 * calculates the index of the next orientation by adding 1 to the current index
 * and taking the modulo 4 to ensure that the index wraps around to the beginning
 * of the array if it exceeds the array length.
 * @param image 
 * @returns 
 */
export const rotateDocumentImage = async (image: DocumentImage): Promise<DocumentImage> => {
    const orientations: ('0' | '90' | '180' | '270')[] = ['0', '90', '180', '270'];
    const index = orientations.indexOf(image.textOrientation);
    const nextIndex = (index + 1) % 4;
    const rotatedImageData = await sharp(image.data)
        .rotate(90)
        .toBuffer();

    return {
        ...image,
        textOrientation: orientations[nextIndex],
        data: rotatedImageData,
    };
};
