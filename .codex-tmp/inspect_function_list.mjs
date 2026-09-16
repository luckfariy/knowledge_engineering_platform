import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/lucky/海致/知识工程平台/知识工程图谱平台功能清单.xlsx";
const outDir = "/Users/lucky/海致/知识工程平台/.codex-tmp/function-list-preview";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));

const summary = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 20,
  tableMaxCols: 12,
  tableMaxCellChars: 180,
});
console.log(summary.ndjson);

const sheets = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 4000 });
console.log(sheets.ndjson);

await fs.mkdir(outDir, { recursive: true });
for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange();
  if (!used) continue;
  const region = await workbook.inspect({
    kind: "region",
    sheetId: sheet.name,
    range: used.address,
    maxChars: 30000,
    tableMaxRows: 500,
    tableMaxCols: 20,
    tableMaxCellChars: 500,
  });
  console.log(region.ndjson);
  const rendered = await workbook.render({ sheetName: sheet.name, autoCrop: "all", scale: 1.25, format: "png" });
  await fs.writeFile(`${outDir}/${sheet.name}.png`, new Uint8Array(await rendered.arrayBuffer()));
}
