import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import BlurryDetector, { BlurryDetectorReport } from '../../src/utils/blur-detector'; // Adjust the import path accordingly

describe('./src/utils/blur-detector.ts', () => {
  let blurryDetector: BlurryDetector;

  beforeEach(() => {
    blurryDetector = new BlurryDetector(); // Using the default threshold of 300
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should detect a clear image', async () => {
    // Mock computeLaplacianVariance to return a high variance indicating a clear image
    blurryDetector.computeLaplacianVariance = jest.fn(() => {
        return Promise.resolve(450)
    });

    const result: BlurryDetectorReport = await blurryDetector.analyse('path/to/clear/image.jpg');

    expect(result).toEqual({
      imagePath: 'path/to/clear/image.jpg',
      isBlurry: false,
      score: 450,
    });
  });

  it('should detect a blurry image', async () => {
    // Mock computeLaplacianVariance to return a low variance indicating a blurry image
    blurryDetector.computeLaplacianVariance = jest.fn(() => {
        return Promise.resolve(220)
    });

    const result: BlurryDetectorReport = await blurryDetector.analyse('path/to/blurry/image.jpg');

    expect(result).toEqual({
      imagePath: 'path/to/blurry/image.jpg',
      isBlurry: true,
      score: 220,
    });
  });
});
