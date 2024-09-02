<template>
  <v-app id="app">
    <v-container>
      <v-row>
        <v-col>
          <Input :listItems="listItems" />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Input from "./components/Input.vue";
import { getMathJSON } from "./components/getMathJSON";
import { mathFunctionModel } from "./models/mathFunction.model";

export default defineComponent({
  name: "App",
  components: {
    Input,
  },
  async beforeMount() {
    this.listItems = await getMathJSON();
  },

  data() {
    return {
      listItems: [] as mathFunctionModel[],
    };
  },
});
</script>

<style>
.body {
  font-family: Roboto, sans-serif;
}
</style>
