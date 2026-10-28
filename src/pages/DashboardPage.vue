
<template>
  <q-page class="dashboard-page q-pa-lg">
    <div class="dashboard-container">


      <div class="dashboard-header q-mb-xl">
        <div class="text-h4 text-weight-bold">
             Painel
        </div>

        <div class="text-subtitle1 text-grey-7 q-mt-sm">

        </div>
      </div>


      <div class="dashboard-cards">


        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">
              Total de explicadores
            </div>

            <div class="text-h3 text-weight-bold text-grey-9 q-mt-sm">
              {{ total }}
            </div>

            <div class="text-caption text-grey-6 q-mt-sm">

            </div>
          </q-card-section>
        </q-card>


        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">
              Contactados
            </div>

            <div class="text-h3 text-weight-bold text-grey-9 q-mt-sm">
              {{ quantidadePorEstado('Contactado') }}
            </div>

            <div class="text-caption text-grey-6 q-mt-sm">

            </div>
          </q-card-section>
        </q-card>


        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">
              Interessado
            </div>

            <div class="text-h3 text-weight-bold text-grey-9 q-mt-sm">
              {{ quantidadePorEstado('Interessado') }}
            </div>

            <div class="text-caption text-grey-6 q-mt-sm">

            </div>
          </q-card-section>
        </q-card>


        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">
              Sem resposta
            </div>

            <div class="text-h3 text-weight-bold text-grey-9 q-mt-sm">
              {{ quantidadePorEstado('Sem resposta') }}
            </div>

            <div class="text-caption text-grey-6 q-mt-sm">

            </div>
          </q-card-section>
        </q-card>


        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">
               Não contactado
            </div>

            <div class="text-h3 text-weight-bold text-grey-9 q-mt-sm">
              {{ quantidadePorEstado('Não contactado') }}
            </div>

            <div class="text-caption text-grey-6 q-mt-sm">

            </div>
          </q-card-section>
        </q-card>


         <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">
               Não interessado
            </div>

            <div class="text-h3 text-weight-bold text-grey-9 q-mt-sm">
              {{ quantidadePorEstado('Não contactado') }}
            </div>

            <div class="text-caption text-grey-6 q-mt-sm">

            </div>
          </q-card-section>
        </q-card>
      </div>


      <q-card flat bordered class="content-card q-mt-xl">

        <q-card-section>
          <div class="text-h6 text-weight-bold">
            Estado dos contactos
          </div>

          <div class="text-grey-7 text-caption q-mt-xs">
            Quantidade de explicadores em cada estado.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>


          <div
            v-if="total === 0"
            class="empty-state text-center q-pa-xl"
          >
            <div class="text-h6 text-grey-8">
              Ainda não existem explicadores
            </div>

            <div class="text-body2 text-grey-7 q-mt-sm">

            </div>
          </div>


          <q-list v-else separator>
            <q-item
              v-for="item in resumoEstados"
              :key="item.nome"
              class="estado-item q-py-md"
            >
              <q-item-section>
                <q-item-label class="text-body1 text-grey-9">
                  {{ item.nome }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <span class="text-weight-bold text-grey-9 quantidade-estado">
                  {{ item.quantidade }}
                </span>
              </q-item-section>
            </q-item>
          </q-list>


          <div
            v-if="total > 0"
            class="row items-center justify-between q-mt-lg"
          >
            <span class="text-body2 text-grey-7">
              Total de registos
            </span>

            <span class="text-weight-bold text-h6 text-grey-9">
              {{ total }}
            </span>
          </div>

        </q-card-section>
      </q-card>


      <div class="text-caption text-grey-6 q-mt-lg">

      </div>

    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useExplicadores } from '../composables/useExplicadores'

const { explicadores } = useExplicadores()


const lista = computed(() => {
  return Array.isArray(explicadores.value)
    ? explicadores.value
    : []
})

function normalizarTexto(valor) {
  return String(valor ?? '')
    .trim()
    .toLocaleLowerCase('pt')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
}


function normalizarEstado(valor) {
  const estado = normalizarTexto(valor)

  const estadosValidos = {
    'nao contactado': 'Não contactado',
    'contactado': 'Contactado',
    'interessado': 'Interessado',
    'sem resposta': 'Sem resposta',
    'nao interessado': 'Não interessado'
  }

  return estadosValidos[estado] || 'Não contactado'
}


const total = computed(() => lista.value.length)

const estados = [
  { nome: 'Não contactado' },
  { nome: 'Contactado' },
  { nome: 'Interessado' },
  { nome: 'Sem resposta' },
  { nome: 'Não interessado' }
]


const resumoEstados = computed(() => {
  return estados.map(estado => {
    const quantidade = lista.value.filter(explicador => {
      return normalizarEstado(explicador.estado) === estado.nome
    }).length

    return {
      ...estado,
      quantidade
    }
  })
})


function quantidadePorEstado(nomeEstado) {
  const estadoNormalizado = normalizarEstado(nomeEstado)

  const resultado = resumoEstados.value.find(item => {
    return item.nome === estadoNormalizado
  })

  return resultado ? resultado.quantidade : 0
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100%;
  background: #f5f7fb;
}

.dashboard-container {
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
}

.dashboard-header {
  padding: 8px 0;
}


.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
}


.stat-card,
.content-card {
  height: 100%;
  min-width: 0;
  background: #fff;
  border-radius: 14px;
  border-color: #e5e7eb;
}

.stat-card {
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}


.quantidade-estado {
  font-size: 16px;
}


@media (max-width: 1200px) {
  .dashboard-cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}


@media (max-width: 768px) {
  .dashboard-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .dashboard-page {
    padding: 16px;
  }

  .dashboard-header .text-h4 {
    font-size: 26px;
  }
}


@media (max-width: 420px) {
  .dashboard-cards {
    grid-template-columns: 1fr;
  }
}

.estado-item {
  min-height: 58px;
}

.empty-state {
  border-radius: 12px;
  background: #f8fafc;
}
</style>
