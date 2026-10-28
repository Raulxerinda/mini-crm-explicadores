import { ref, computed } from 'vue'
import { criarExplicador } from '../models/explicador'

const STORAGE_KEY = 'mini-crm-explicadores'

function normalizarTexto(valor) {
  return String(valor ?? '')
    .trim()
    .toLocaleLowerCase('pt')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
}


function normalizarEstado(estado) {
  const texto = normalizarTexto(estado)

  const estados = {
    'nao contactado': 'Não contactado',
    'contactado': 'Contactado',
    'interessado': 'Interessado',
    'sem resposta': 'Sem resposta',
    'nao interessado': 'Não interessado'
  }

  return estados[texto] || 'Não contactado'
}


function prepararExplicador(dados = {}) {
  const dadosSeguros =
    dados && typeof dados === 'object' ? dados : {}

  return criarExplicador({
    ...dadosSeguros,
    estado: normalizarEstado(dadosSeguros.estado)
  })
}


function lerDados() {
  try {
    if (typeof localStorage === 'undefined') {
      return []
    }

    const dados = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )

    if (!Array.isArray(dados)) {
      return []
    }

    return dados
      .filter(item => item && typeof item === 'object')
      .map(item => prepararExplicador(item))
  } catch (erro) {
    console.error('Erro ao ler explicadores:', erro)
    return []
  }
}


const explicadores = ref(lerDados())


function salvar() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(explicadores.value)
    )
  } catch (erro) {
    console.error('Erro ao guardar explicadores:', erro)
    throw erro
  }
}

function adicionar(dados) {
  const novoExplicador = prepararExplicador(dados)

  explicadores.value.push(novoExplicador)

  try {
    salvar()
  } catch (erro) {
    explicadores.value.pop()
    throw erro
  }

  return novoExplicador
}


function editar(id, dados) {
  const index = explicadores.value.findIndex(
    item => String(item.id) === String(id)
  )

  if (index === -1) {
    throw new Error(
      'O explicador que pretendes editar não foi encontrado.'
    )
  }

  const anterior = explicadores.value[index]
  const dadosNovos =
    dados && typeof dados === 'object' ? dados : {}

  const actualizado = prepararExplicador({
    ...anterior,
    ...dadosNovos,
    id: anterior.id,
    dataCadastro: anterior.dataCadastro,
    estado: dadosNovos.estado ?? anterior.estado
  })

  explicadores.value[index] = actualizado

  try {
    salvar()
  } catch (erro) {
    explicadores.value[index] = anterior
    throw erro
  }

  return actualizado
}


function remover(id) {
  const anterior = explicadores.value

  const actualizados = anterior.filter(
    item => String(item.id) !== String(id)
  )

  if (actualizados.length === anterior.length) {
    throw new Error('O explicador não foi encontrado.')
  }

  explicadores.value = actualizados

  try {
    salvar()
  } catch (erro) {
    explicadores.value = anterior
    throw erro
  }
}


function limpar() {
  const anterior = explicadores.value

  explicadores.value = []

  try {
    salvar()
  } catch (erro) {
    explicadores.value = anterior
    throw erro
  }
}


function alternarFavorito(id) {
  const index = explicadores.value.findIndex(
    item => String(item.id) === String(id)
  )

  if (index === -1) {
    throw new Error('O explicador não foi encontrado.')
  }

  const anterior = explicadores.value[index]

  explicadores.value[index] = {
    ...anterior,
    favorito: !anterior.favorito
  }

  try {
    salvar()
  } catch (erro) {
    explicadores.value[index] = anterior
    throw erro
  }

  return explicadores.value[index].favorito
}


const total = computed(() => explicadores.value.length)

const favoritos = computed(() =>
  explicadores.value.filter(item => item.favorito).length
)


function contarEstado(estadoPretendido) {
  const estadoNormalizado = normalizarEstado(estadoPretendido)

  return explicadores.value.filter(
    item => normalizarEstado(item.estado) === estadoNormalizado
  ).length
}

const contactados = computed(() =>
  contarEstado('Contactado')
)

const interessados = computed(() =>
  contarEstado('Interessado')
)

const semResposta = computed(() =>
  contarEstado('Sem resposta')
)

const porContactar = computed(() =>
  contarEstado('Não contactado')
)

const naoInteressados = computed(() =>
  contarEstado('Não interessado')
)


export function useExplicadores() {
  return {
    explicadores,
    total,
    favoritos,
    contactados,
    interessados,
    semResposta,
    porContactar,
    naoInteressados,
    adicionar,
    editar,
    remover,
    limpar,
    alternarFavorito
  }
}
