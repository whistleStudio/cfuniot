// const ExcelJS = require("exceljs")

/* 生成表格 */
function genWorkbook (arr, dataName) {
  let workbook = new ExcelJS.Workbook()
  let d = new Date()
  let sheet = workbook.addWorksheet(`${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`)
  sheet.columns = [
    {header: '时间', key: 'time', width: '30'},
    {header: '数值', key: 'value', width: '30'}
  ]
  // 表格第一行第二行
  let row1 = sheet.getRow(1), row2 = sheet.getRow(2)
  row1.values = [`${dataName}`]
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

/* 解析表格 */
function parseWorkbook (rawFile) {
  return new Promise(rsv => {
    const reader = new FileReader()
    let res = []
    try {
      reader.readAsArrayBuffer(rawFile)
      reader.onload = function () {
        ;(async () => {
          try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(this.result);
            const worksheet = workbook.getWorksheet(1)
            // console.log(workbook)
            if (worksheet) {
              const reg1 = /^([0-9]+)(:|：)([0-9]+)(:|：)([0-9]+)$/, reg2 = /^([0-9]+)$/
              for (let i = 3; i <= worksheet.rowCount; i++) {
                let v1 = worksheet.getRow(i).values[1], v2 = worksheet.getRow(i).values[2]
                if (reg1.test(v1) && reg2.test(v2)) {
                  res.push([v1, v2])
                }
              }
              console.log("....", worksheet.rowCount, worksheet.getRow(3).values)
            }
            rsv(res)
          } catch(e){console.log("eeee"); rsv(null)}
        })()
      }
    } catch(e){console.log("errr"); rsv(null)}
  })
}


export { genWorkbook, parseWorkbook }