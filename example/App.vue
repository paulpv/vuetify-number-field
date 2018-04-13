<template>
  <v-app dark>
    <v-content class="ma-4">
      v-number-field
      <v-number-field
        v-for="(item, index) in items"
        :key="item.id"
        :label="`Price ${index}`"
        class="input-group--focused inputPrice"
        :autofocus="index === 0"
        color="cyan lighten-2"
        clearable
        v-model.number="item.price"
        :hide-details="!item.invalidPrice"
        :error-messages="item.invalidPrice ? 'Invalid price' : undefined"
        @input="item.invalidPrice = false"
        >
      </v-number-field>
      <br/>
      <pre>
      Items: {{ items }}
      </pre>
    </v-content>
  </v-app>
</template>

<script>
import VNumberField from '../src'

export default {
  components: {
    VNumberField
  },
  data () {
    return {
      items: [
        { id: 'a', price: null, invalidPrice: false },
        { id: 'b', price: null, invalidPrice: false }
      ],
    }
  }  
}
</script>

<style scoped>
.inputPrice >>> input {
  text-align: right;
  -moz-appearance:textfield;
}
.inputPrice >>> input::-webkit-outer-spin-button,
.inputPrice >>> input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
