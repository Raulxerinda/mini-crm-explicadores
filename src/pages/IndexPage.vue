
<template>
  <div class="q-pa-md bg-grey-2 page-container">
    <div class="container">
      <!-- Cabeçalho -->
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h4 text-weight-bold">Explicadores</div>
          <div class="text-subtitle2 text-grey-7 q-mt-sm">
            Gere os teus explicadores, contactos e informações
          </div>
        </div>

        <q-btn
          color="primary"
          icon="add"
          label="Novo explicador"
          unelevated
          no-caps
          @click="abrirNovo"
        />
      </div>


      <q-card flat bordered class="section-card q-mb-lg">
        <q-card-section>
          <div class="text-h6 text-weight-bold q-mb-md">
            Pesquisar e filtrar
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="filtros.pesquisa"
                outlined
                dense
                label="Pesquisar por nome, telefone ou email"
                clearable
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-sm-6 col-md-2">
              <q-select
                v-model="filtros.area"
                :options="areas"
                outlined
                dense
                label="Disciplina"
                clearable
              />
            </div>

            <div class="col-12 col-sm-6 col-md-2">
              <q-select
                v-model="filtros.provincia"
                :options="provincias"
                outlined
                dense
                label="Província"
                clearable
              />
            </div>

            <div class="col-12 col-sm-6 col-md-2">
              <q-select
                v-model="filtros.cidade"
                :options="cidades"
                outlined
                dense
                label="Cidade"
                clearable
              />
            </div>

            <div class="col-12 col-sm-6 col-md-2">
              <q-select
                v-model="filtros.estado"
                :options="estados"
                outlined
                dense
                label="Estado"
                clearable
              />
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <q-select
                v-model="filtros.classe"
                :options="classes"
                outlined
                dense
                label="Classe"
                clearable
              />
            </div>
          </div>
        </q-card-section>
      </q-card>


      <q-card flat bordered class="section-card">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-h6 text-weight-bold">
              Lista de explicadores
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Consulta, edita e gere os teus registos.
            </div>
          </div>

          <q-badge
            color="primary"
            :label="`${explicadoresFiltrados.length} resultado(s)`"
          />
        </q-card-section>

        <q-separator />

        <q-table
          :rows="explicadoresFiltrados"
          :columns="columns"
          row-key="id"
          flat
          :pagination="{ rowsPerPage: 10 }"
          :rows-per-page-options="[10, 20, 50]"
          no-data-label="Ainda não existem explicadores registados."
          no-results-label="Nenhum resultado encontrado para os filtros seleccionados."
        >
          <template #body-cell-areas="props">
            <q-td :props="props">
              <div class="row q-gutter-xs">
                <q-badge
                  v-for="area in obterAreas(props.row)"
                  :key="area"
                  color="blue-1"
                  text-color="blue-10"
                  :label="area"
                />
                <span
                  v-if="!obterAreas(props.row).length"
                  class="text-grey-6"
                >
                  Não indicada
                </span>
              </div>
            </q-td>
          </template>

          <template #body-cell-classes="props">
            <q-td :props="props">
              <div class="row q-gutter-xs">
                <q-badge
                  v-for="classe in obterClasses(props.row)"
                  :key="classe"
                  color="grey-3"
                  text-color="grey-9"
                  :label="classe"
                />
                <span
                  v-if="!obterClasses(props.row).length"
                  class="text-grey-6"
                >
                  Não indicada
                </span>
              </div>
            </q-td>
          </template>

          <template #body-cell-estado="props">
            <q-td :props="props">
              <q-badge
                :color="corEstado(props.row.estado)"
                :label="props.row.estado"
              />
            </q-td>
          </template>

          <template #body-cell-favorito="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                :color="props.row.favorito ? 'amber-8' : 'grey-6'"
                :icon="props.row.favorito ? 'star' : 'star_border'"
                :aria-label="props.row.favorito
                  ? 'Remover dos favoritos'
                  : 'Marcar como favorito'"
                @click="alternarFavoritoExplicador(props.row)"
              >
                <q-tooltip>
                  {{ props.row.favorito
                    ? 'Remover dos favoritos'
                    : 'Marcar como favorito' }}
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="edit"
                aria-label="Editar explicador"
                @click="editarExplicador(props.row)"
              >
                <q-tooltip>Editar explicador</q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                aria-label="Eliminar explicador"
                @click="confirmarRemocao(props.row)"
              >
                <q-tooltip>Eliminar explicador</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- Formulário de cadastro e edição -->
    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="form-dialog">
        <q-form ref="formRef" @submit.prevent="guardarExplicador">
          <q-card-section class="row items-center">
            <div>
              <div class="text-h6 text-weight-bold">
                {{ modoEdicao ? 'Editar explicador' : 'Novo explicador' }}
              </div>
              <div class="text-caption text-grey-7">
                Preenche os dados do explicador.
              </div>
            </div>

            <q-space />

            <q-btn
              flat
              round
              dense
              icon="close"
              aria-label="Fechar formulário"
              :disable="aGuardar"
              @click="fecharFormulario"
            />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-caption text-grey-7 q-mb-md">
              Os campos  são obrigatórios.
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="form.nome"
                  outlined
                  label="Nome completo"
                  placeholder="Nome do explicador"
                  maxlength="120"
                  :rules="[
                    valor => !!String(valor || '').trim() ||
                      'O nome completo é obrigatório.',
                    valor => String(valor || '').trim().length >= 3 ||
                      'O nome deve ter pelo menos 3 caracteres.'
                  ]"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.telefone"
                  outlined
                  label="Telefone"
                  mask="+258 #########"
                  placeholder="+258 84 0000000"
                  clearable
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.email"
                  outlined
                  label="Email"
                  type="email"
                  placeholder="Insira o seu email"
                  clearable
                  :rules="[
                    valor => !valor ||
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor) ||
                      'Introduza um endereço de email válido.'
                  ]"
                />
              </div>

              <div class="col-12">
                <q-select
                  v-model="form.areas"
                  :options="areas"
                  outlined
                  label="Disciplinas de ensino"
                  multiple
                  use-chips
                  use-input
                  new-value-mode="add-unique"
                  hint="Podes seleccionar várias disciplinas."
                  :rules="[
                    valores => (Array.isArray(valores) && valores.length > 0) ||
                      'Seleccione pelo menos uma disciplina.'
                  ]"
                />
              </div>

              <div class="col-12">
                <q-select
                  v-model="form.classes"
                  :options="classes"
                  outlined
                  label="Classes que pode ensinar"
                  multiple
                  use-chips
                  hint="Podes seleccionar várias classes."
                  :rules="[
                    valores => (Array.isArray(valores) && valores.length > 0) ||
                      'Seleccione pelo menos uma classe'
                  ]"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.provincia"
                  :options="provincias"
                  outlined
                  label="Província"
                  use-input
                  new-value-mode="add"
                  :rules="[
                    valor => !!String(valor || '').trim() ||
                      'Seleccione ou indique a província.'
                  ]"
                />
              </div>

               <div class="col-12 col-md-6">
                <q-input
                  v-model="form.cidade"
                  outlined
                  label="Cidade ou distrito"
                  placeholder="Ex.: Beira, Tete ou Matola"
                />
              </div>

              <div class="col-12">
                <q-select
                  v-model="form.estado"
                  :options="estados"
                  outlined
                  label="Estado do contacto"
                  :rules="[
                    valor => !!valor || 'Seleccione o estado do contacto.'
                  ]"
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model="form.observacoes"
                  outlined
                  type="textarea"
                  label="Observações"
                  placeholder="Informações adicionais sobre o explicador."
                  autogrow
                  maxlength="1000"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              flat
              label="Cancelar"
              color="grey-7"
              :disable="aGuardar"
              @click="fecharFormulario"
            />

            <q-btn
              color="primary"
              :label="modoEdicao ? 'Actualizar dados' : 'Guardar explicador'"
              unelevated
              type="submit"
              :loading="aGuardar"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Confirmação de eliminação -->
    <q-dialog v-model="dialogRemover" persistent>
      <q-card class="remove-dialog">
        <q-card-section>
          <div class="text-h6 text-weight-bold">
            Confirmar eliminação
          </div>
        </q-card-section>

        <q-card-section>
          Tens a certeza de que pretendes eliminar
          <strong>{{ explicadorSelecionado?.nome }}</strong>?
          <div class="text-caption text-grey-7 q-mt-sm">
            Esta operação não pode ser desfeita.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancelar"
            :disable="aRemover"
            @click="dialogRemover = false"
          />

          <q-btn
            color="negative"
            label="Sim, eliminar"
            unelevated
            :loading="aRemover"
            @click="removerExplicador"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'

import { useExplicadores } from '../composables/useExplicadores'
import {
  ESTADOS_CONTACTO,
  AREAS_ENSINO,
  CLASSES_ENSINO
} from '../models/explicador'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const {
  explicadores,
  adicionar,
  editar,
  remover,
  alternarFavorito
} = useExplicadores()

const estados = ESTADOS_CONTACTO
const areas = AREAS_ENSINO
const classes = CLASSES_ENSINO

const provincias = [
  'Maputo Cidade',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa'
]

const filtros = ref({
  pesquisa: '',
  area: null,
  provincia: null,
  cidade: null,
  estado: null,
  classe: null
})

function obterAreas(item) {
  if (Array.isArray(item.areas)) return item.areas
  return item.area ? [item.area] : []
}

function obterClasses(item) {
  return Array.isArray(item.classes) ? item.classes : []
}

const cidades = computed(() => {
  const lista = explicadores.value
    .map(item => String(item.cidade || '').trim())
    .filter(Boolean)

  return [...new Set(lista)].sort((a, b) => a.localeCompare(b, 'pt'))
})

const explicadoresFiltrados = computed(() => {
  const pesquisa = String(filtros.value.pesquisa || '')
    .trim()
    .toLocaleLowerCase('pt')

  return explicadores.value.filter(item => {
    const textoPesquisa = [
      item.nome,
      item.telefone,
      item.email
    ].join(' ').toLocaleLowerCase('pt')

    const areasItem = obterAreas(item)
    const classesItem = obterClasses(item)

    return (
      textoPesquisa.includes(pesquisa) &&
      (!filtros.value.area || areasItem.includes(filtros.value.area)) &&
      (!filtros.value.provincia ||
        item.provincia === filtros.value.provincia) &&
      (!filtros.value.cidade || item.cidade === filtros.value.cidade) &&
      (!filtros.value.estado || item.estado === filtros.value.estado) &&
      (!filtros.value.classe || classesItem.includes(filtros.value.classe))
    )
  })
})

const columns = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'areas', label: 'Disciplinas', field: row => obterAreas(row).join(', '), align: 'left' },
  { name: 'classes', label: 'Classes', field: row => obterClasses(row).join(', '), align: 'left' },
  { name: 'provincia', label: 'Província', field: 'provincia', align: 'left' },
  { name: 'cidade', label: 'Cidade', field: 'cidade', align: 'left' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'favorito', label: 'Favorito', field: 'favorito', align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

const dialogAberto = ref(false)
const dialogRemover = ref(false)
const modoEdicao = ref(false)
const explicadorSelecionado = ref(null)
const aGuardar = ref(false)
const aRemover = ref(false)
const formRef = ref(null)

const formularioInicial = () => ({
  nome: '',
  telefone: '',
  email: '',
  areas: [],
  classes: [],
  provincia: '',
  cidade: '',
  estado: 'Não contactado',
  observacoes: ''
})

const form = ref(formularioInicial())

function formularioVazio() {
  form.value = formularioInicial()
  formRef.value?.resetValidation()
}

function abrirNovo() {
  modoEdicao.value = false
  explicadorSelecionado.value = null
  formularioVazio()
  dialogAberto.value = true
}

function editarExplicador(item) {
  modoEdicao.value = true
  explicadorSelecionado.value = item

  form.value = {
    nome: item.nome || '',
    telefone: item.telefone || '',
    email: item.email || '',
    areas: obterAreas(item).slice(),
    classes: obterClasses(item).slice(),
    provincia: item.provincia || '',
    cidade: item.cidade || '',
    estado: item.estado || 'Não contactado',
    observacoes: item.observacoes || ''
  }

  formRef.value?.resetValidation()
  dialogAberto.value = true
}

function validarTelefone() {
  const telefone = String(form.value.telefone || '').trim()
  if (!telefone) return true

  const digitos = telefone.replace(/\D/g, '')
  return digitos.length === 12 && digitos.startsWith('258')
}

function notificarSucesso(mensagem, detalhe = '') {
  $q.notify({
    type: 'positive',
    message: mensagem,
    caption: detalhe,
    icon: 'check_circle',
    position: 'top',
    timeout: 3500
  })
}

function notificarErro(mensagem, detalhe = '') {
  $q.notify({
    type: 'negative',
    message: mensagem,
    caption: detalhe,
    icon: 'error',
    position: 'top',
    timeout: 5000
  })
}

async function guardarExplicador() {
  if (aGuardar.value) return

  const valido = await formRef.value?.validate()
  if (!valido) return

  if (!validarTelefone()) {
    notificarErro(
      'Número de telefone inválido.',
      'Utiliza o formato moçambicano +258 841234567.'
    )
    return
  }

  aGuardar.value = true

  try {
    const estaAEditar = modoEdicao.value

    const dados = {
      ...form.value,
      nome: form.value.nome.trim(),
      telefone: String(form.value.telefone || '').trim(),
      email: String(form.value.email || '').trim(),
      areas: [...form.value.areas],
      classes: [...form.value.classes],
      // Mantém compatibilidade com código antigo que usa "area".
      area: form.value.areas[0] || '',
      provincia: String(form.value.provincia || '').trim(),
      cidade: String(form.value.cidade || '').trim(),
      observacoes: String(form.value.observacoes || '').trim()
    }

    if (estaAEditar && explicadorSelecionado.value) {
      editar(explicadorSelecionado.value.id, dados)
    } else {
      adicionar(dados)
    }

    dialogAberto.value = false
    formularioVazio()
    explicadorSelecionado.value = null

    notificarSucesso(
      estaAEditar
        ? 'Explicador actualizado com sucesso!'
        : 'Explicador registado com sucesso!'
    )
  } catch (erro) {
    console.error('Erro ao guardar explicador:', erro)
    notificarErro(
      'Não foi possível guardar os dados.',
      erro?.message || 'Verifica as informações e tenta novamente.'
    )
  } finally {
    aGuardar.value = false
  }
}

function fecharFormulario() {
  if (aGuardar.value) return

  dialogAberto.value = false
  formularioVazio()
  explicadorSelecionado.value = null
}

function confirmarRemocao(item) {
  explicadorSelecionado.value = item
  dialogRemover.value = true
}

function removerExplicador() {
  if (!explicadorSelecionado.value || aRemover.value) return

  aRemover.value = true

  try {
    const nome = explicadorSelecionado.value.nome
    remover(explicadorSelecionado.value.id)

    dialogRemover.value = false
    explicadorSelecionado.value = null

    notificarSucesso(
      'Explicador eliminado com sucesso!',
      `O registo de ${nome} foi removido da lista.`
    )
  } catch (erro) {
    console.error('Erro ao eliminar explicador:', erro)
    notificarErro(
      'Não foi possível eliminar o explicador.',
      erro?.message || 'Tenta novamente.'
    )
  } finally {
    aRemover.value = false
  }
}

function alternarFavoritoExplicador(item) {
  const eraFavorito = Boolean(item.favorito)

  try {
    alternarFavorito(item.id)

    notificarSucesso(
      eraFavorito
        ? 'Explicador removido dos favoritos.'
        : 'Explicador marcado como favorito!',
      item.nome
    )
  } catch (erro) {
    console.error('Erro ao actualizar favorito:', erro)
    notificarErro(
      'Não foi possível actualizar os favoritos.',
      erro?.message || 'Tenta novamente.'
    )
  }
}

function corEstado(estado) {
  const cores = {
    'Não contactado': 'grey',
    Contactado: 'blue',
    Interessado: 'positive',
    'Sem resposta': 'orange',
    'Não interessado': 'negative'
  }

  return cores[estado] || 'grey'
}

watch(
  () => route.query.novo,
  valor => {
    if (valor === '1') {
      abrirNovo()
      router.replace({ path: '/explicadores' })
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.page-container {
  min-height: 100%;
  background: #f5f7fb;
}

.container {
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
}

.section-card {
  border-radius: 14px;
  background: #fff;
}

.form-dialog {
  width: 700px;
  max-width: 95vw;
  border-radius: 14px;
}

.remove-dialog {
  width: 440px;
  max-width: 95vw;
  border-radius: 14px;
}

@media (max-width: 600px) {
  .page-container {
    padding: 12px;
  }

  .text-h4 {
    font-size: 25px;
  }
}
</style>
