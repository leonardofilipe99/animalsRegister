<template>
  <q-table
    title="Vacas Cadastradas"
    :data="$store.state.animals"
    :columns="columns"
    row-key="name"
  >
    <template v-slot:top-right>
      <q-btn
        color="green"
        icon-right="archive"
        label=".csv"
        no-caps
        @click.native="forFileDownload()"
      />
    </template>
    <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer">
      <q-td v-for="col in props.cols" :key="col.name" :props="props">
        {{ col.value }}
      </q-td>
      <q-btn-group outline>
        <q-btn @click.native="modal(props.row)" color="green" icon="delete" />
        <q-btn
          @click.native="details(props.row)"
          color="green"
          icon="assignment"
        />
        <q-btn
          @click.native="editAnimal(props.row.number)"
          color="green"
          icon="edit"
        />
      </q-btn-group>
    </q-tr>
  </q-table>
</template>

<script>
import moment from "moment";

export default {
  name: "Record",
  props: {
    callMethod: Function,
  },
  data: () => ({
    animal: {},
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
    modal(row) {
      this.animal = row;
      this.$q
        .dialog({
          title: "Excluir Animal",
          message: "Deseja realmente excluir o animal?",
          ok: {
            color: "negative",
            label: "Excluir",
          },
          cancel: "Cancelar",
        })
        .then(() => {
          this.deleteAnimal();
        })
        .catch(() => {});
    },
    details(row) {
      this.callMethod(row);
    },
    deleteAnimal() {
      this.$store.dispatch("deleteAnimal", this.animal);
      this.confirm = false;
    },
    editAnimal(row) {
      this.$router.push("/add-animal/" + row);
    },
    forFileDownload() {
      var csv = this.csvContent();

      var blob = new Blob(csv, { type: "text/csv;charset=utf-8;" });
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${moment().format("DDMMYYYYhmmss")}.csv`;
      link.click();
      link.remove();
    },
    csvContent() {
      var items = this.$store.state.animals;
      var header =
        "ID;Nome;Data Nasc;Data Fecundacao;Tipo Fecundacao;Ultimo Parto;Prenha;Qntd Bezerros;Data Prox Parto\n";
      var csv = [];
      csv.push(header);
      for (var row in items) {
        var line = `${items[row].number};${items[row].name};${items[row].birthday};${items[row].fecundation};${items[row].fecundationType};${items[row].parturition};${items[row].pregnancy};${items[row].qtdBezerros};${items[row].dateParto}\n`;
        line = line
          .replace(/undefined/gi, "")
          .replace(/true/gi, "Sim")
          .replace(/false/gi, "Nao");
        csv.push(line);
      }
      return csv;
    },
    building() {
      this.$q.notify({
        timeout: 1000,
        position: "top",
        color: "positive",
        message: "Aguarde nova versão",
      });
    },
  },
};
</script>