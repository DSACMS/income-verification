import sharp from "sharp";
import photon from "@silvia-odwyer/photon-node"
import fs from "fs";

function computeVariance(vector: Buffer | Uint8Array) {
  const mean =
    vector.reduce((sum, value) => sum + value, 0) /
    vector.length;
  const variance =
    vector.reduce(
      (sum, value) => sum + Math.pow(value - mean, 2),
      0
    ) / vector.length;

  return variance;
}

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

    const base64 = fs.readFileSync(imagePath, { encoding: 'base64' });
    const data = base64.replace(/^data:image\/(png|jpg);base64,/, "");
    const phtn_img = photon.PhotonImage.new_from_base64(data);
    photon.grayscale(phtn_img);
    photon.laplace(phtn_img);
    const output = phtn_img.get_base64();
    const laplacianImageData = photon.base64_to_vec(output.replace(/^data:image\/(png|jpg);base64,/, ""));

    const jpegified = await sharp(imagePath).toFormat("jpeg").toBuffer();

    // Convolve the image with the Laplacian kernel
    const laplacianImageData2 = await sharp(jpegified)
      .greyscale()
      .raw()
      .convolve(laplacianKernel)
      .toBuffer();

    console.log(computeVariance(laplacianImageData), computeVariance(laplacianImageData2));
    // Compute the variance of the Laplacian image

    const variance = computeVariance(laplacianImageData);

    return variance;
  }

  async analyse(imagePath: string): Promise<{ isBlurry: boolean, score: number }> {
    let variance;
    try {
      variance = await this.computeLaplacianVariance(imagePath);
    } catch (e) {
      console.log(e);
    }

    return {
      isBlurry: variance < this.threshold,
      score: variance,
    };
  }
}

// Export the class for CommonJS
export default BlurryDetector;
