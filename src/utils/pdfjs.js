// src/utils/pdfjs.js (v4-ready)
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

// Tell pdf.js where the worker lives
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default pdfjsLib;
