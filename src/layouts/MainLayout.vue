<template>
  <q-layout view="lHh Lpr lFf">


    <q-header elevated class="bg-primary text-white">
      <q-toolbar>

        <q-btn
          flat
          round
          dense
          icon="menu"
          aria-label="Abrir ou fechar menu"
          @click="menuAberto = !menuAberto"
        />

        <q-toolbar-title>
          Mini CRM de Explicadores
        </q-toolbar-title>

      </q-toolbar>
    </q-header>


    <q-drawer
      v-model="menuAberto"
      bordered
    >
      <q-list padding>


        <q-item
          clickable
          v-ripple
          to="/"
          exact
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section>
            Início
          </q-item-section>
        </q-item>


        <q-item
          clickable
          v-ripple
          to="/explicadores"
        >
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>

          <q-item-section>
            Explicadores
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>


    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'


const menuAberto = ref(true)
</script>
