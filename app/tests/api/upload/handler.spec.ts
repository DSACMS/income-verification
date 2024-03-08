import handler from "@/pages/api/upload";
import { createDocumentImage } from "@/service/factories";
import { type DocumentImage } from "@/utils/document";
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

  it("should handle multiple file uploads", async () => {
    const { req, res } = createMocks({
      method: "POST",
      query: { processingType: "blur" },
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
            imagePath:
              "/var/folders/g4/chfpyqbn7l74n7v9__5y4pwh0000gp/T/adp-earnings-statement1",
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
            path: "/tmp/uploaded2.png", // this file definitely doesn't exist
          },
        },
      ],
    };

    // Check that the response status code is 200
    expect(result).toEqual(expected);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toHaveProperty("message", "Success!");
  });
});
