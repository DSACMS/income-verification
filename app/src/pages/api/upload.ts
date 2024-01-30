import Busboy from "busboy";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import os from "os";
import path from "path";
import { inspect } from "util";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {
  message: string;
};

async function r(req: NextApiRequest) {
  return new Promise((resolve) => {
    const busboy = Busboy({ headers: req.headers });

    // From example: https://gist.github.com/konojunya/b337a4e048b5dac4f9385b5a0cfd7c62
    busboy.on(
      "file",
      (
        fieldname: object,
        file: string,
        filename: string,
        encoding: string,
        mimetype: string
      ): void => {
        console.log(
          "File [" +
            fieldname +
            "]: filename: " +
            inspect(filename) +
            ", encoding: " +
            encoding +
            ", mimetype: " +
            mimetype
        );
        file.on("data", (data) => {
          console.log("File [" + fieldname + "] got " + data.length + " bytes");
        });
        file.on("end", () => {
          console.log("File [" + fieldname + "] Finished");
          console.log(`File [${fieldname}] Written to ${saveTo}`);
        });

        const saveTo = path.join(os.tmpdir(), filename.filename);
        file.pipe(fs.createWriteStream(saveTo));
      }
    );
    busboy.on("finish", () => {
      console.log("Done parsing form!");

      resolve(1);
    });
    req.pipe(busboy);
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    await r(req);
    res.status(200).json({ message: "Success!" });
  }
}
