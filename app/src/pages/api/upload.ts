import formidable from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const form = formidable({});
    const [, files] = await form.parse(req);

    Object.values(files).forEach((filelist = []) => {
      const [file] = filelist;
      if (file) {
        const saveTo = path.join(os.tmpdir(), file.originalFilename || "");
        fs.writeFileSync(saveTo, fs.readFileSync(file.filepath));
        console.log(saveTo);
      }
    });

    // todo: handle failure scenario!
    res.status(200).json({ message: "Success!" });
  }
}
