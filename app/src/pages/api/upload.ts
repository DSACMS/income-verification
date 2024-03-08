import { createDocumentImage } from "@/service/factories";
import OCR, { type ProcessedRotatedImagesResult } from "@/service/ocr";
import formidable from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import path from "path";

import type { BlurryDetectorReport } from "../../utils/blur-detector";
import BlurryDetector from "../../utils/blur-detector";

export type BlurryDetectorResults = Array<{
  status: "fulfilled" | "rejected";
  value?: BlurryDetectorReport;
  reason?: BlurryDetectorReport;
}>;

type Files = formidable.Files<string>;

type OCRDetectionResult = {
  file: formidable.File;
  data: ProcessedRotatedImagesResult;
};

export type OCRDectionResponse = {
  fulfilled: ProcessedRotatedImagesResult[];
  rejected: unknown[];
};

export type ResponseData = {
  message: string;
  results?: BlurryDetectorResults | OCRDectionResponse;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const { processDocument } = OCR;

// The threshold is based on a few articles about this approach
// "The threshold can be set based on performance on the data we have."
// Further testing is needed to better attune it to doc upload
// https://www.linkedin.com/pulse/pinpointing-blurry-images-simple-nodejs-way-pablo-schaffner-bofill/
const slightBlurDetector = new BlurryDetector(300);

const blurDectionAction = async (files: Files) => {
  const results: BlurryDetectorResults = await Promise.allSettled(
    Object.values(files).map(async (filelist = []) => {
      const [file] = filelist;
      if (file) {
        const saveTo = path.join(os.tmpdir(), file.originalFilename || "");
        fs.writeFileSync(saveTo, fs.readFileSync(file.filepath));
        const result = await slightBlurDetector.analyse(saveTo);

        console.log(
          `File [${saveTo}] is blurry? ${result.isBlurry ? "yes" : "no"} with ${
            result.score
          }`
        );

        if (result.isBlurry) {
          // rejects the promise
          throw result;
        }

        return result;
      }
    })
  );

  return results;
};

const ocrDetectionAction = async (
  files: Files
): Promise<{
  fulfilled: ProcessedRotatedImagesResult[];
  rejected: unknown[];
}> => {
  const results = (await Promise.allSettled(
    Object.values(files).map(async (filelist = []) => {
      const [file] = filelist;
      const saveTo = path.join(os.tmpdir(), file.originalFilename || "");
      fs.writeFileSync(saveTo, fs.readFileSync(file.filepath));
      const document = await createDocumentImage(saveTo);
      const processed = await processDocument(document);
      const result = {
        file: file,
        data: processed,
      };

      return result;
    })
  )) as PromiseSettledResult<{
    status: "fulfilled" | "rejected";
    value?: OCRDetectionResult;
    reason?: unknown;
  }>[];

  // it is possible have files that have been rejected or fulfilled
  // rejection reasons include, but are not limited to
  // - the file is not an image
  // - the file is too large
  // - the file is corrupt
  // - the file is not found

  const fulfilledFiles = results.filter(
    (result) => result.status === "fulfilled"
  ) as unknown as { status: "fulfilled"; value: OCRDetectionResult }[];

  const rejectedFiles = results.filter(
    (result) => result.status === "rejected"
  ) as unknown as PromiseRejectedResult[];

  const fulfilled = fulfilledFiles.map((result) => {
    // don't send the image data to the client
    result.value.data.map((doc) => {
      delete doc.image;
      return doc;
    });
    return result.value.data;
  });

  const rejected = rejectedFiles.map((result) => {
    return result.reason as unknown;
  });

  return {
    fulfilled,
    rejected,
  };
};

const engines = ["ocr", "blur"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const form = formidable({});
    const [, files] = await form.parse(req);
    let engine = "ocr";

    // get the document processor we'd like to use from the query string
    if (req.query.engine) {
      engine = req.query.engine as string;
    }

    if (!engines.includes(engine)) {
      res.status(400).json({
        message: "Engine not supported",
      });
      return;
    }

    // processing type can be ocr or blur
    if (engine === "ocr") {
      const results = await ocrDetectionAction(files);
      res.status(200).json({
        message: "Success!",
        results,
      });
    }

    if (engine === "blur") {
      const results = await blurDectionAction(files);
      res.status(200).json({
        message: "Success!",
        results,
      });
    }
  }
}
