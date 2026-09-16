import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "/Users/lucky/海致/知识工程平台/outputs/20260915-v2-function-list/知识工程图谱平台功能清单-V2.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const sheets = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 4000 });
console.log(sheets.ndjson);
const summary = await workbook.inspect({ kind: "table", range: "版本与模块汇总!A3:F11", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 6, maxChars: 7000 });
console.log(summary.ndjson);
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "saved workbook formula error scan",
});
console.log(errors.ndjson);
