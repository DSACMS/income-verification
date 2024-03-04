import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { rotateDocumentImage, createDocumentImage, DocumentImage } from '@/utils/document';
import fs from 'fs';
import path from 'path';

const tmpPath = path.join(__dirname, "../var");
const sourcePath = path.join(
    __dirname,
    "../fixture/adp-earnings-statement1.jpeg"
);

const createTmpPath = (image: DocumentImage) => `${tmpPath}/${image.fileName}.${image.orientation}.${image.metaData.format}`

const writeImageToDisk = (image: DocumentImage) => {
    const filePath = createTmpPath(image);
    fs.writeFileSync(filePath, image.data);
    console.log(`Image written to ${filePath} for visual comparison.`);
};

describe('Image Rotation', () => {
    let originalImage: DocumentImage;

    beforeEach(async () => {
        originalImage = await createDocumentImage(sourcePath);
    });

    afterEach(() => {
        // Cleanup: Delete generated files after each test (optional)
        const orientations: ('0' | '90' | '180' | '270')[] = ['0', '90', '180', '270'];
        orientations.forEach((orientation) => {
            const filePath = createTmpPath({ ...originalImage, orientation });
            if (fs.existsSync(filePath)) {
            // optionally delete the tmp test files after each test
               // fs.unlinkSync(filePath);
            }
        });
    });

    it('should rotate the image by 90 degrees', async () => {
        const rotatedImage = await rotateDocumentImage(originalImage);
        expect(rotatedImage.orientation).toBe('90');
        writeImageToDisk(rotatedImage);
    });

    it('should properly cycle through all orientations', async () => {
        let rotatedImage = await rotateDocumentImage(originalImage);
        for (let i = 1; i <= 3; i++) { // Rotate three more times to complete the cycle
            rotatedImage = await rotateDocumentImage(rotatedImage);
            writeImageToDisk(rotatedImage);
        }
        expect(rotatedImage.orientation).toBe('0'); // Should return to original orientation after 4 rotations
    });
});
