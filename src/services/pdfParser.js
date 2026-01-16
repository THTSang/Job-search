import { PDFParse } from "pdf-parse";
import fs from "fs/promises";

/**
 * Parse a PDF file and extract its content
 * @param {string|Buffer} input - File path or buffer
 * @returns {Promise<Object>} Parsed PDF data
 */
export async function parsePdf(input) {
  let dataBuffer;

  if (typeof input === "string") {
    // Input is a file path
    dataBuffer = await fs.readFile(input);
  } else if (Buffer.isBuffer(input)) {
    // Input is already a buffer
    dataBuffer = input;
  } else {
    throw new Error("Input must be a file path (string) or a Buffer");
  }

  // Create PDFParse instance with the data
  const pdfParser = new PDFParse({ data: dataBuffer });

  // Get text content
  const textResult = await pdfParser.getText();

  // Get document info/metadata
  const infoResult = await pdfParser.getInfo();

  // Clean up
  await pdfParser.destroy();

  return {
    text: textResult.text,
    numPages: textResult.pages.length,
    pages: textResult.pages.map((page) => ({
      pageNumber: page.pageNumber,
      text: page.text,
    })),
    info: infoResult.info,
    metadata: infoResult.metadata,
  };
}

/**
 * Extract structured sections from CV text
 * @param {string} text - Raw text extracted from PDF
 * @returns {Object} Structured CV sections
 */
export function extractCvSections(text) {
  const sections = {
    raw: text,
    contact: null,
    summary: null,
    experience: null,
    education: null,
    skills: null,
  };

  // Common section headers (case-insensitive)
  const sectionPatterns = {
    contact: /(?:contact|personal\s*info|personal\s*details)/i,
    summary:
      /(?:summary|profile|objective|about\s*me|professional\s*summary)/i,
    experience:
      /(?:experience|work\s*experience|employment|work\s*history|professional\s*experience)/i,
    education: /(?:education|academic|qualifications|degrees)/i,
    skills: /(?:skills|technical\s*skills|competencies|expertise|technologies)/i,
  };

  // Split text into lines for processing
  const lines = text.split("\n").filter((line) => line.trim());

  let currentSection = null;
  let currentContent = [];

  for (const line of lines) {
    // Check if line is a section header
    let foundSection = null;
    for (const [section, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(line) && line.trim().length < 50) {
        foundSection = section;
        break;
      }
    }

    if (foundSection) {
      // Save previous section content
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join("\n").trim();
      }
      currentSection = foundSection;
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection && currentContent.length > 0) {
    sections[currentSection] = currentContent.join("\n").trim();
  }

  return sections;
}

/**
 * Parse PDF and extract CV sections
 * @param {string|Buffer} input - File path or buffer
 * @returns {Promise<Object>} Parsed and structured CV data
 */
export async function parseCv(input) {
  const pdfData = await parsePdf(input);
  const sections = extractCvSections(pdfData.text);

  return {
    ...sections,
    pages: pdfData.pages,
    metadata: {
      numPages: pdfData.numPages,
      info: pdfData.info,
    },
  };
}
