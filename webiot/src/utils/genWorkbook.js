const ExcelJS = require("exceljs")

/* 生成表格 */
function genWorkbook (arr, dataName) {
  let workbook = new ExcelJS.Workbook()
  let d = new Date(), name = curName, dev = actName
  let sheet = workbook.addWorksheet(`${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`)
  sheet.columns = [
    {header: '时间', key: 'time', width: '30'},
    {header: '数值', key: 'value', width: '30'}
  ]
  // 表格第一行第二行
  let row1 = sheet.getRow(1), row2 = sheet.getRow(2)
  row1.values = [`${name}-${dev}${dataName}`]
  row1.font = {size: 14, underline: 'single', bold: true, color: { argb: 'FFFFFFFF'}}
  fillColor(row1, 'FF538DD5')
  sheet.mergeCells('A1:B1')
  row1.commit()
  row2.values = ['时间', '数值']
  row2.font = {bold: true, color: {argb: 'FFFFFFFF'}}
  fillColor(row2, 'FF538DD5')
  row2.commit()
  // 表格正文
  for (let i in arr) {
    i = parseInt(i)
    var row = sheet.getRow(i+3)
    row.values = [arr[i][0], arr[i][1]]
    row.eachCell((cell) => {cell.alignment = {horizontal: 'left'}})
    row.commit()
  }
  return workbook
}
function fillColor (row, color) {
  row.eachCell(cell => {
    cell.fill = {type: 'pattern',pattern: 'solid', fgColor:{ argb: color}}
  })
}

export default genWorkbook