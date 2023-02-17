<template>
  <div class="column" style="padding: 16px">
    <form @submit.prevent="search">
      <div class="row gutter-md column">
        <div class="flex justify-center">
          <q-input
            v-model="number"
            icon="search"
            hint="Buscar"
            float-label="Identificação do Animal"
          >
            <template>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn type="submit" color="green" label="Buscar" />
        </div>
      </div>
    </form>
    <br />
    <div v-if="showCard">
      <p>
        <q-card inline style="width: 100%">
          <q-card-title>
            {{ animal.name }}
            <em
              v-if="parto()"
              class="q-px-sm bg-deep-orange text-white rounded-borders"
              >Improdutiva</em
            >
            <em
              v-if="!parto()"
              class="q-px-sm bg-green text-white rounded-borders"
              >Produtiva</em
            >
            <q-btn
              round
              flat
              icon="close"
              slot="right"
              @click.native="showCard = false"
            />
            <!--  <q-rating slot="subtitle" v-model="stars" :max="5" />-->
            <div>
              <q-icon name="vpn_key" />
              ID: {{ animal.number }}
              <q-icon name="event" />
              Nascimento: {{ animal.birthday | date }}
              <q-icon name="info" class="text-faded" />
              {{ animal.fecudationType }}
            </div>
          </q-card-title>
          <q-card-main>
            <p class="text-faded">
              Último Parto: {{ animal.parturition | date }}
            </p>
            <p class="text-faded">
              Data de Fecundação: {{ animal.fecudation | date }}
            </p>
            <p class="text-faded">
              Diagnóstico de Gestação:
              {{ animal.pregnancy ? "Prenha" : "Vazia" }}
            </p>
          </q-card-main>
          <q-card-separator />
          <!--SEPARADOR PARA RELATO DE PREVISÕES-->
          <q-card-main v-if="animal.pregnancy">
            <q-card-title>
              <q-icon name="note" />RELATO DE PREVISÕES
            </q-card-title>
            <p class="text-faded">
              Previsão de Parto: {{ animal.fecudation | dateAdd("282") }}
            </p>
            <p class="text-faded">
              Previsão de Secagem: {{ animal.fecudation | dateAdd("222") }}
            </p>
            <p class="text-faded">
              Intervalo de Parto:
              {{ animal.parturition | dateInterval(282, animal.fecudation) }}
              DIAS
            </p>
          </q-card-main>
          <q-card-separator />
          <!--SEPARADOR PARA RELATO DE PARTO-->
          <q-card-main v-if="animal.relatorio && animal.pregnancy">
            <q-card-title> <q-icon name="note" />RELATO DE PARTO </q-card-title>
            <p class="text-faded">
              Quantidade de Bezerros: {{ animal.qtdBezerros }}
            </p>
            <p class="text-faded">
              Data do Parto: {{ animal.dateParto | date }}
            </p>
          </q-card-main>
          <q-card-separator />
          <q-card-actions>
            <q-btn
              @click="edit"
              color="green"
              label="Editar"
              style="margin-right: 8px"
            />
            <q-btn
              @click="showModal = true"
              color="green"
              label="Fecundação"
              style="margin-right: 8px"
            />
            <q-btn
              @click="showModal2 = true"
              color="green"
              label="PARTO"
              style="margin-right: 8px"
            />
          </q-card-actions>
        </q-card>
      </p>
    </div>
    <q-modal v-model="showModal" minimized>
      <div style="padding: 16px">
        <div class="q-title text-center">Adicionar Dados</div>
        <q-field>
          <q-input
            v-if="stage()"
            style="padding: 16px"
            stack-label="Data último parto"
            type="date"
            v-model="animal.parturition"
          />
        </q-field>
        <q-field>
          <q-input
            style="padding: 16px"
            stack-label="Data fecundação"
            type="date"
            v-model="animal.fecudation"
          />
        </q-field>
        <q-field>
          <q-radio
            style="padding: 16px"
            val="cobertura"
            label="Cobertura"
            v-model="animal.fecudationType"
          />
          <q-radio
            style="padding: 16px"
            val="inseminacao"
            label="Inseminação"
            v-model="animal.fecudationType"
          />
        </q-field>
        <q-field>
          <q-toggle
            :readonly="pregnancy()"
            style="padding: 16px"
            v-model="animal.pregnancy"
            label="Prenha"
          />
        </q-field>
        <q-btn
          round
          @click="save"
          color="green"
          icon="check"
          style="margin-right: 8px"
        />
      </div>
    </q-modal>
    <q-modal v-model="showModal2" minimized>
      <div style="padding: 16px">
        <div class="q-title text-center">Dados do Parto</div>
        <q-field>
          <q-input
            style="padding: 16px"
            stack-label="Quantos Bezerros?"
            type="number"
            v-model="animal.qtdBezerros"
          />
        </q-field>

        <q-field>
          <q-input
            style="padding: 16px"
            stack-label="Data Nascimento Bezerro"
            type="date"
            v-model="animal.dateParto"
          />
        </q-field>

        <q-field>
          <q-toggle
            style="padding: 16px"
            v-model="animal.relatorio"
            label="Pariu"
          />
        </q-field>
        <q-btn
          round
          @click="save"
          color="green"
          icon="check"
          style="margin-right: 8px"
        />
      </div>
    </q-modal>
    <DataTable :callMethod="openData"></DataTable>
  </div>
</template>

<script>
import moment from "moment";
import DataTable from "./DataTable";

export default {
  name: "InsertData",
  components: {
    DataTable,
  },
  data() {
    return {
      number: null,
      animal: {},
      showModal: false,
      showModal2: false,
      showCard: false,
    };
  },
  created() {
    if (this.$route.params.number) {
      this.number = parseInt(this.$route.params.number, 10);
      this.search();
    }
  },
  methods: {
    parto() {
      const end = moment(this.animal.fecudation).add(282, "days");
      if (moment(end).diff(this.animal.parturition, "days") > 381) return true;
      return false;
    },
    pregnancy() {
      if (moment(this.animal.fecudation) >= moment().subtract(60, "days"))
        return true;
      return false;
    },
    validations() {
      if (
        moment(this.animal.fecudation) <
        moment(this.animal.parturition).add(45, "days")
      ) {
        this.$q.notify({
          message: "Vaca em período de espera",
          timeout: 1000,
          icon: "error_outline",
          position: "top",
        });
        return false;
      }
      if((moment(this.animal.fecudation) > moment())){
        this.$q.notify({
          message: "Fecundação deve ser menor que a data atual",
          timeout: 1000,
          icon: "error_outline",
          position: "top",
        });
        return false;
      }
      return true;
    },
    stage() {
      if (moment(this.animal.birthday) < moment().subtract(24, "months"))
        return true;
      return false;
    },
    save() {
      if (this.validations()) {
        this.$store.dispatch("editAnimal", this.animal);
        this.showModal = false;
        this.showModal2 = false;
      }
    },
    openData: function (data) {
      this.animal = data;
      this.showCard = true;
    },
    search() {
      if (!this.number) {
        this.$q.notify({
          message: "Dados inválidos",
          timeout: 1000,
          icon: "error_outline",
          position: "top",
        });
      } else {
        const vaca = this.$store.state.animals.find((animal) => {
          return animal.number === parseInt(this.number, 10);
        });
        if (vaca) {
          this.animal = vaca;
          this.showCard = true;
        } else {
          this.showCard = false;
          this.animal = {};
          this.$q.notify({
            message: "Vaca não cadastrada",
            timeout: 1000,
            icon: "error_outline",
            position: "top",
          });
        }
      }
    },
    edit() {
      this.$router.push("/add-animal/" + this.animal.number);
    },
  },
};
</script>