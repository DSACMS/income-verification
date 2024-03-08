import handler, { ResponseData } from "@/pages/api/upload";
import { createDocumentImage } from "@/service/factories";
import { type DocumentImage } from "@/utils/document";
import { assertAdpEarningsStatement } from "@test/assertions/adpEarningsStatement";
import { NextApiRequest, NextApiResponse } from "next";
// Adjust the import path as necessary
import { createMocks } from "node-mocks-http";
import path from "path";
import { beforeAll, describe, expect, it, vi } from "vitest";

let testDocument: DocumentImage;

// Mock `formidable` correctly as a function
vi.mock("formidable", () => {
  return {
    // Mock the default export to be a function that returns an instance with a `parse` method
    default: () => ({
      parse: () => {
        // Simulate the file structure that formidable would produce
        const file1 = {
          filepath: testDocument.sourcePath,
          originalFilename: testDocument.fileName,
          mimetype: "image/jpeg",
        };
        const file2 = {
          filepath: "/tmp/uploaded2.png",
          originalFilename: "test2.png",
          mimetype: "image/png",
        };
        // Simulated files object
        const files = { file1: [file1], file2: [file2] };
        // Simulated fields object (empty in this case)
        const fields = {};
        return [fields, files];
      },
    }),
  };
});

describe("File Upload API Endpoint", () => {
  beforeAll(async () => {
    vi.clearAllMocks();
    // setup our test document
    const testDocumentPath = path.join(
      __dirname,
      "../../fixture/adp-earnings-statement1.jpeg"
    );
    testDocument = await createDocumentImage(testDocumentPath);
  });

  it(
    "should test the ocr parser",
    async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: { engine: "ocr" },
      });

      // Do some type casting to make TS happy since we don't mock the entire req and res objects
      const nextReq = req as unknown as NextApiRequest;
      const nextRes = res as unknown as NextApiResponse;

      await handler(nextReq, nextRes);
      const responseData = res._getJSONData() as ResponseData;

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toHaveProperty("message", "Success!");


      expect(responseData.results.fulfilled.length).toBe(1);
      const result = responseData.results.fulfilled[0];
      assertAdpEarningsStatement(result);
    },
    {
      timeout: 10000,
    }
  );

  it(
    "should test the blur algorithm",
    async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: { engine: "blur" },
      });

      // Do some type casting to make TS happy since we don't mock the entire req and res objects
      const nextReq = req as unknown as NextApiRequest;
      const nextRes = res as unknown as NextApiResponse;

      await handler(nextReq, nextRes);
      const result = res._getJSONData() as unknown;
      const expected = {
        message: "Success!",
        results: [
          {
            status: "fulfilled",
            value: {
              imagePath: expect.anything() as string,
              isBlurry: false,
              score: 1125.6740445003702,
            },
          },
          {
            status: "rejected",
            reason: {
              errno: -2,
              code: "ENOENT",
              syscall: "open",
              path: "/tmp/uploaded2.png",
            },
          },
        ],
      };

      // Check that the response status code is 200
      expect(result).toEqual(expected);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toHaveProperty("message", "Success!");
    },
    {
      timeout: 10000,
    }
  );
});
