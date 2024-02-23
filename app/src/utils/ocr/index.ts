import { createWorker } from 'tesseract.js';

const ocr = async (path: string, debug = false) => {
    const worker = await createWorker('eng', 1, {
        logger: debug ? () => undefined : (m) => console.info(m)
    });
    const result = await worker.recognize(path);
    const output = result.data.text;
    await worker.terminate();

    return output;
}

export default ocr;
