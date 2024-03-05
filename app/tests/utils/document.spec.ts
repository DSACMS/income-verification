import { createDocumentImage } from "@/service/factory";
import { DocumentImage, rotateDocumentImage } from "@/utils/document";
import fs from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const tmpPath = path.join(__dirname, "../var");

const sourcePath = path.join(
  __dirname,
  "../fixture/adp-earnings-statement1.jpeg"
);

const createTmpPath = (image: DocumentImage) =>
  `${tmpPath}/${image.fileName}.${image.textOrientation}.${
    image.metaData.format as string
  }`;

const writeImageToDisk = (image: DocumentImage) => {
  const filePath = createTmpPath(image);
  fs.writeFileSync(filePath, image.data);
  console.log(`Image written to ${filePath} for visual comparison.`);
};

describe("Image Rotation", () => {
  let originalImage: DocumentImage;

  beforeAll(() => {
    if (!fs.existsSync(tmpPath)) {
      fs.mkdirSync(tmpPath);
    }
  });

  beforeEach(async () => {
    originalImage = await createDocumentImage(sourcePath);
  });

  afterEach(() => {
    // Cleanup: Delete generated files after each test (optional)
    const orientations: ("0" | "90" | "180" | "270")[] = [
      "0",
      "90",
      "180",
      "270",
    ];
    orientations.forEach((textOrientation) => {
      const filePath = createTmpPath({ ...originalImage, textOrientation });
      if (fs.existsSync(filePath)) {
        // optionally delete the tmp test files after each test
        // fs.unlinkSync(filePath);
      }
    });
  });

  it("should rotate the image by 90 degrees", async () => {
    const rotatedImage = await rotateDocumentImage(originalImage);
    expect(rotatedImage.textOrientation).toBe("90");
    writeImageToDisk(rotatedImage);
  });

  it("should properly cycle through all text orientations", async () => {
    let rotatedImage = await rotateDocumentImage(originalImage);
    for (let i = 1; i <= 3; i++) {
      // Rotate three more times to complete the cycle
      rotatedImage = await rotateDocumentImage(rotatedImage);
      writeImageToDisk(rotatedImage);
    }
    expect(rotatedImage.textOrientation).toBe("0"); // Should return to original orientation after 4 rotations
  });
});
