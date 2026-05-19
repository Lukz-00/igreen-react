import * as XLSX from 'xlsx'

function clean(row) {
  const o = {}
  for (const [k,v] of Object.entries(row)) {
    if (k.startsWith('_')) continue
    o[k] = v===null||v===undefined ? '' : v
  }
  return o
}

export function exportarFaturamento(res) {
  const wb = XLSX.utils.book_new()
  const resumo = [
    ['Cruzamento Pagadoria x Recebíveis',''],
    ['Data', new Date().toLocaleDateString('pt-BR')],
    ['',''],
    ['Resultado','Quantidade'],
    ['UCs em ambas (matches)', res.emAmbos],
    ['Divergência Cód. Barras', (res.divergenciasCod||[]).length],
    ['Sem Pagto / Valor', (res.semPagtoValor||[]).length],
    ['Status Divergentes', res.divergentes.length],
    ['Falta nos Recebíveis', res.faltaRec.length],
    ['Falta na Pagadoria', res.faltaPag.length],
    ['Status Coincidentes', res.coincidentes.length],
    ['Duplicidades', (res.duplicidadesPag||[]).length],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumo), 'RESUMO')
  if((res.divergenciasCod||[]).length) XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(res.divergenciasCod.map(clean)),'DIVERGENCIA COD')
  if((res.semPagtoValor||[]).length)   XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(res.semPagtoValor.map(clean)),'SEM PAGTO E VALOR')
  if(res.divergentes.length)           XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(res.divergentes.map(clean)),'STATUS DIVERGENTES')
  if(res.faltaRec.length)              XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(res.faltaRec.map(clean)),'FALTA NOS RECEBIVEIS')
  if(res.faltaPag.length)              XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(res.faltaPag.map(clean)),'FALTA NA PAGADORIA')
  if(res.coincidentes.length)          XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(res.coincidentes.map(clean)),'COINCIDENTES')
  if((res.duplicidadesPag||[]).length) XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(res.duplicidadesPag.map(clean)),'DUPLICIDADES')
  XLSX.writeFile(wb, `cruzamento_${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.xlsx`)
}

export function lerXlsx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type:'array', cellDates:true })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const raw = XLSX.utils.sheet_to_json(ws, { defval:'' })
        resolve(raw)
      } catch(err) { reject(err) }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}