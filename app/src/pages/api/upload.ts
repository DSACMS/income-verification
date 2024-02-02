import formidable from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import path from "path";

import BlurryDetector from "../../utils/blur-detector";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {
  message: string;
};

// The threshold is based on a few articles about this approach
// "The threshold can be set based on performance on the data we have."
// Further testing is needed to better attune it to doc upload
// https://www.linkedin.com/pulse/pinpointing-blurry-images-simple-nodejs-way-pablo-schaffner-bofill/
const slightBlurDetector = new BlurryDetector(300);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const form = formidable({});
    const [, files] = await form.parse(req);

    await Promise.all(
      Object.values(files).map(async (filelist = []) => {
        const [file] = filelist;
        if (file) {
          const saveTo = path.join(os.tmpdir(), file.originalFilename || "");
          fs.writeFileSync(saveTo, fs.readFileSync(file.filepath));
          const isBlurry = await slightBlurDetector.isImageBlurry(saveTo);

          console.log(`File [${saveTo}] is blurry? ${isBlurry ? "yes" : "no"}`);
        }
      })
    );

    // todo: handle failure scenario!
    res.status(200).json({ message: "Success!" });
  }
}