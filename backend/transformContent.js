import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// To resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hardcoded input file path
const inputFilePath = path.join(__dirname, "input.json");
// Optional: const outputFilePath = path.join(__dirname, 'output.json');

function transformContent(input) {
    const version = input.content.editModeVersionData || input.content.liveModeVersionData;
  
    // Helper function to transform a section (handles nested sections recursively)
    const transformSection = (section) => {
      const formattedSection = {
        sectionId: section.sectionId,
        order: section.order,
        content: section.content,
      };
  
      // Handle items if they exist
      if (section.items) {
        formattedSection.items = section.items.map((item) => ({
          order: item.order,
          id: item.id,
          resourceType: item.resourceType,
        }));
      }
  
      // Handle nested sections if they exist
      if (section.sections) {
        formattedSection.sections = section.sections.map(transformSection);
      }
  
      return formattedSection;
    };
  
    const formattedContent = {
      content: {
        resourceId: input.content.id,
        titleEn: input.content.titleEn,
        titleAr: input.content.titleAr,
        slug: input.content.slug,
        newVersionEditMode: {
          comments: version.comments,
          referenceDoc: version.referenceDoc,
          content: version.content,
          icon: version.icon,
          image: version.image,
          sections: version.sections.map(transformSection),
        },
      },
    };
  
    return formattedContent;
  }

function processFile() {
  try {
    const rawData = fs.readFileSync(inputFilePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    const transformed = transformContent(jsonData);

    fs.writeFileSync(
      inputFilePath,
      JSON.stringify(transformed, null, 2),
      "utf-8"
    );
    console.log(`File successfully transformed and saved to ${inputFilePath}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

processFile();
