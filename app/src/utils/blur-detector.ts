import sharp from "sharp";

// https://github.com/puntorigen/blurry-detector/blob/main/index.js
class BlurryDetector {
  threshold: number;

  constructor(threshold = 300) {
    this.threshold = threshold;
  }

  async computeLaplacianVariance(imagePath: string) {
    // Define the Laplacian kernel
    const laplacianKernel = {
      width: 3,
      height: 3,
      kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0],
    };

    const jpegified = await sharp(imagePath)
      .toFormat("jpeg")
      .toBuffer();

    // Convolve the image with the Laplacian kernel
    const laplacianImageData = await sharp(jpegified)
      .greyscale()
      .raw()
      .convolve(laplacianKernel)
      .toBuffer();

    // Compute the variance of the Laplacian image
    const mean =
      laplacianImageData.reduce((sum, value) => sum + value, 0) /
      laplacianImageData.length;
    const variance =
      laplacianImageData.reduce(
        (sum, value) => sum + Math.pow(value - mean, 2),
        0
      ) / laplacianImageData.length;
    return variance;
  }

  async isImageBlurry(imagePath: string): Promise<boolean> {
    const variance = await this.computeLaplacianVariance(imagePath);
    console.log(`Blurriness score: ${variance}`);
    return variance < this.threshold;
  }
}

// Export the class for CommonJS
export default BlurryDetector;
