import { useState } from 'react'

export function DataTable({ rows=[], maxRows=300 }) {
  const [pagina, setPagina] = useState(0)
  if (!rows.length) return <div className="text-center py-12 text-tx3 text-sm">Nenhum registro encontrado.</div>

  const headers = Object.keys(rows[0]).filter(k => !k.startsWith('_'))
  const slice = rows.slice(pagina*maxRows, (pagina+1)*maxRows)
  const totalPags = Math.ceil(rows.length/maxRows)

  return (
    <div>
      <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              {headers.map(h=>(
                <th key={h} className="text-left px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-tx3 bg-s2 border-b border-bd whitespace-nowrap sticky top-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((row,i)=>(
              <tr key={i} className="border-b border-bd hover:bg-s2/50 transition-colors">
                {headers.map(h=>(
                  <td key={h} className="px-3 py-2.5 text-tx2 whitespace-nowrap max-w-[240px] truncate"
                    title={String(row[h]??'')}>
                    {String(row[h]??'—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPags > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-bd bg-s2 text-[11px] text-tx3">
          <span>{rows.length.toLocaleString('pt-BR')} registros · página {pagina+1} de {totalPags}</span>
          <div className="flex gap-2">
            <button onClick={()=>setPagina(p=>Math.max(0,p-1))} disabled={pagina===0}
              className="px-3 py-1 border border-bd rounded hover:bg-s3 disabled:opacity-40">← Anterior</button>
            <button onClick={()=>setPagina(p=>Math.min(totalPags-1,p+1))} disabled={pagina===totalPags-1}
              className="px-3 py-1 border border-bd rounded hover:bg-s3 disabled:opacity-40">Próxima →</button>
          </div>
        </div>
      )}
    </div>
  )
}