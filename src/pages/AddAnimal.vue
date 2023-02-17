<template>
  <div style="padding: 16px">
    <div class="q-title text-center">{{ title }}</div>
    <form @submit.prevent="save">
      <div class="row gutter-md">
        <div class="col-12">
          <q-field>
            <q-input
              ref="name"
              filled
              stack-label="Nome da Vaca"
              v-model="animal.name"
            />
          </q-field>
        </div>
        <div class="col-12">
          <q-field>
            <q-input
              ref="cNumber"
              type="number"
              placeholder="000"
              stack-label="Registro da Vaca"
              v-model="animal.number"
            />
          </q-field>
        </div>
        <div class="col-12">
          <q-field>
            <q-input
              ref="age"
              type="date"
              stack-label="Data de Nascimento da Vaca"
              v-model="animal.birthday"
            />
          </q-field>
        </div>
      </div>
      <br />
      <div style="padding: 16px" class="flex justify-center">
        <q-btn type="submit" color="green" label="Salvar" />
      </div>
    </form>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "AddAnimal",
  data: () => ({
    animal: {},
    title: "Cadastro de Animal",
    columns: [
      {
        name: "number",
        required: true,
        label: "ID",
        align: "left",
        field: "number",
        sortable: true,
        classes: "my-class",
        style: "width: 25px",
      },
      {
        name: "name",
        label: "Nome",
        field: "name",
        align: "left",
        style: "width: 250px",
        sortable: true,
      },
      {
        name: "birthday",
        label: "Nascimento",
        field: "birthday",
        align: "left",
        sortable: true,
        format: (val) => moment(val).format("DD/MM/Y"),
      },
    ],
  }),
  methods: {    
    validate() {
      if (!this.animal.name || !this.animal.birthday || !this.animal.number) {
        this.$q.notify({
          message: "Por favor preencha todos os campos",
          timeout: 1000,
          icon: "error_outline",
          position: "top",
        });

        return false;
      }
      if (moment(this.animal.birthday) > moment()) {
        this.$q.notify({
          message: "Data de nascimento inválida",
          timeout: 1000,
          icon: "error_outline",
          position: "top",
        });

        return false;
      }
      if (!this.$route.params.number) {
        if (
          this.$store.state.animals.find((a) => a.number === this.animal.number)
        ) {
          this.$q.notify({
            message: "Vaca já cadastrada",
            timeout: 1000,
            icon: "error_outline",
            position: "top",
          });

          return false;
        }
      }

      return true;
    },
    save() {
      if (this.validate()) {
        if (this.$route.params.number) {
          this.$store.dispatch("editAnimal", this.animal);
        } else {
          this.animal = {
            birthday: this.animal.birthday,
            dateParto: "",
            fecudation: "",
            fecudationType: "",
            name: this.animal.name,
            number: this.animal.number,
            parturition: "",
            pregnancy: false,
            qtdBezerros: 0,
            relatorio: false,
          };

          if (this.$route.params.number) {
            this.$store.dispatch("editAnimal", this.animal);
          } else {
            this.$store.dispatch("saveAnimal", this.animal);
            this.animal = {};
          }
          this.$q.notify({
            timeout: 1000,
            icon: "done",
            position: "top",
            color: "positive",
            message: "Animal cadastrado com sucesso",
          });
        }
      }
    },
  },
  created() {
    if (this.$route.params.number) {
      const vaca = this.$store.state.animals.find((animal) => {
        return animal.number === parseInt(this.$route.params.number, 10);
      });
      if (vaca) {
        this.title = "Editar Animal";
        this.animal = vaca;
      } else {
        this.$q.notify({
          message: "Vaca não cadastrada",
          timeout: 1000,
          icon: "error_outline",
          position: "top",
        });
      }
    }
  },
};
</script>