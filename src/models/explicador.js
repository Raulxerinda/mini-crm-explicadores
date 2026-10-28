export const ESTADOS_CONTACTO = [
  'Não contactado',
  'Contactado',
  'Interessado',
  'Sem resposta',
  'Não interessado',
]

export const AREAS_ENSINO = [
  'Matemática',
  'Português',
  'Inglês',
  'Física',
  'Química',
  'Biologia',
  'História',
  'Geografia',
  'Informática',
  'Economia',
]

export const CLASSES_ENSINO = [
  '8ª classe',
  '9ª classe',
  '10ª classe',
  '11ª classe',
  '12ª classe',
]

function converterParaLista(valor) {
  if (Array.isArray(valor)) {
    return [...new Set(valor.map((item) => String(item ?? '').trim()).filter(Boolean))]
  }

  if (typeof valor === 'string' && valor.trim()) {
    return [valor.trim()]
  }

  return []
}

function normalizarEstado(valor) {
  const recebido = String(valor || 'Não contactado')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt')

  const encontrado = ESTADOS_CONTACTO.find(
    (estado) =>
      estado
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt') === recebido,
  )

  return encontrado || 'Não contactado'
}

export function criarExplicador(dados = {}) {
  const areas = converterParaLista(dados.areas ?? dados.area)
  const classes = converterParaLista(dados.classes)

  return {
    id:
      dados.id ??
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    nome: String(dados.nome || '').trim(),
    telefone: String(dados.telefone || '').trim(),
    email: String(dados.email || '').trim(),
    areas,
    classes,
    area: areas[0] || '',
    provincia: String(dados.provincia || '').trim(),
    cidade: String(dados.cidade || '').trim(),
    estado: normalizarEstado(dados.estado),
    observacoes: String(dados.observacoes || '').trim(),
    favorito: Boolean(dados.favorito),
    dataCadastro: dados.dataCadastro || new Date().toISOString(),
  }
}
