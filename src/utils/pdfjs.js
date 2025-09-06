import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.js?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc
export default pdfjsLib
