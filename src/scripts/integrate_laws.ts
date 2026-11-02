import * as fs from "fs";
import * as path from "path";

const fetchedJsonPath = path.join(process.cwd(), "src/data/laws/fetched_306_477.json");
const outputTsPath = path.join(process.cwd(), "src/data/laws/obligationsAndContracts_306_477.ts");
const treeTsPath = path.join(process.cwd(), "src/data/laws/obligationsAndContractsTree.ts");

function run() {
  if (!fs.existsSync(fetchedJsonPath)) {
    console.error("Fetched JSON file not found at:", fetchedJsonPath);
    return;
  }

  const data = JSON.parse(fs.readFileSync(fetchedJsonPath, "utf-8"));
  console.log("Loaded fetched JSON with keys count:", Object.keys(data).length);

  // 1. Write the flat .ts data file
  let tsContent = `export const obligationsAndContracts_306_477: Record<string, string> = {\n`;
  const sortedKeys = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
  
  for (const key of sortedKeys) {
    const value = data[key].replace(/"/g, '\\"').replace(/\n/g, '\\n');
    tsContent += `  "${key}": "${value}",\n`;
  }
  tsContent += `};\n`;
  
  fs.writeFileSync(outputTsPath, tsContent, "utf-8");
  console.log("Successfully updated flat data file:", outputTsPath);

  // 2. Generate the tree nodes for Section 7 (Chapters 399 to 477)
  const section7Chapters = sortedKeys.filter(k => {
    const num = parseInt(k);
    return num >= 399 && num <= 477;
  });

  const childrenNodes = section7Chapters.map(key => {
    return {
      id: `chapter-${key}`,
      level: "chapter",
      number: key,
      content: data[key]
    };
  });

  const childrenJson = JSON.stringify(childrenNodes, null, 2);

  // 3. Read tree file and replace the section-7 children
  let treeContent = fs.readFileSync(treeTsPath, "utf-8");
  
  // Find the children block of section-7
  // We can locate it by searching for id: "section-7" and replacing its children
  const section7Index = treeContent.indexOf('"id": "section-7"');
  if (section7Index === -1) {
    console.error("Could not find section-7 in the tree file!");
    return;
  }

  // Find the next "children": [ ... ] block
  const childrenKeyword = '"children": [';
  const childrenStartIndex = treeContent.indexOf(childrenKeyword, section7Index);
  if (childrenStartIndex === -1) {
    console.error("Could not find children array for section-7!");
    return;
  }

  // Find the matching closing bracket for this children array
  let bracketCount = 1;
  let childrenEndIndex = -1;
  for (let i = childrenStartIndex + childrenKeyword.length; i < treeContent.length; i++) {
    if (treeContent[i] === '[') bracketCount++;
    if (treeContent[i] === ']') bracketCount--;
    if (bracketCount === 0) {
      childrenEndIndex = i;
      break;
    }
  }

  if (childrenEndIndex === -1) {
    console.error("Could not find closing bracket of section-7 children!");
    return;
  }

  // Replace this block with our newly generated children list
  const indentedChildrenJson = childrenJson.split("\n").map(line => "          " + line).join("\n").trim();
  const newChildrenBlock = `"children": ${indentedChildrenJson}`;
  
  const updatedTreeContent = treeContent.substring(0, childrenStartIndex) + 
                             newChildrenBlock + 
                             treeContent.substring(childrenEndIndex + 1);

  fs.writeFileSync(treeTsPath, updatedTreeContent, "utf-8");
  console.log("Successfully updated tree structure file:", treeTsPath);
}

run();
