import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const base = "/Users/lucky/海致/知识工程平台/outputs/20260915-actual-product-function-list";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(`${base}/知识工程图谱平台功能清单-实际产品设计版.xlsx`));
const moduleMatches = await workbook.inspect({
  kind: "match",
  searchTerm: "^[一二三四五六七]、",
  options: { useRegex: true, maxResults: 20 },
  summary: "module start rows",
  maxChars: 6000,
});
console.log(moduleMatches.ndjson);

const ranges = [
  ["A78:E98", "resource-middle.png"],
  ["A130:E150", "production.png"],
  ["A186:E206", "management.png"],
  ["A215:E235", "service-portal.png"],
  ["A240:E255", "system.png"],
];
for (const [range, filename] of ranges) {
  const rendered = await workbook.render({ sheetName: "平台功能清单", range, scale: 1.2, format: "png" });
  await fs.writeFile(`${base}/${filename}`, new Uint8Array(await rendered.arrayBuffer()));
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "saved workbook formula error scan",
});
console.log(errors.ndjson);
