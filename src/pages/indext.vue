<template>
  <div style="padding: 12px">
    <q-card color="green-5">
      <q-card-main>
        <q-card-title>
          Acompanhe as previsões de parto e secagem do seu rebanho
        </q-card-title>
      </q-card-main>
      <q-card-separator dark inset />
    </q-card>
    <q-card-actions @click.native="$router.push('/add-animal')">
      <q-card inline style="width: 100%; max-width: 100%">
        <q-card-title>
          <div class="text-h6 text-center">Cadastrar Vaca</div>
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          <img
            src="https://www.comprerural.com/wp-content/uploads/2017/06/vacas-jersey-1021x545.jpg"
            width="100%"
          />
        </q-card-main>
        <q-card-separator />
      </q-card>
    </q-card-actions>
    <q-card-actions @click.native="$router.push('/insert-data')">
      <q-card inline style="width: 100%; max-width: 100%">
        <q-card-title>
          <div class="text-h6 text-center">Buscar Vaca</div>
        </q-card-title>
        <q-card-separator />
        <q-card-main>
          <img
            class="center"
            src="https://dicas.boisaude.com.br/wp-content/uploads/2019/02/Ivermectitna-para-vacas-prenhas.jpeg"
            width="100%"
          />
        </q-card-main>
        <q-card-separator />
      </q-card>
    </q-card-actions>
  </div>
</template>
<script>
export default {
  name: "indext",
  data: () => ({
    animal: {},
    title: "Início",
  }),
};
</script>