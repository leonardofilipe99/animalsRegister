<template>
  <DataTable :callMethod="openDetails"></DataTable>
</template>

<script>
import DataTable from "./DataTable";

export default {
  name: "Record",
  components: {
    DataTable,
  },
  methods: {
    openDetails: function (data) {
      this.$router.push("/insert-data/" + data.number);
    },
  },
};
</script>