# vuetify-number-field

[![NPM version](https://img.shields.io/npm/v/@paulpv/vuetify-number-field.svg?style=flat)](https://npmjs.com/package/@paulpv/vuetify-number-field) [![NPM downloads](https://img.shields.io/npm/dm/vuetify-number-field.svg?style=flat)](https://npmjs.com/package/vuetify-number-field)

Number specific variant of Vuetify's v-text-field

NOTE: This is v0.0.1, meaning that I am still working out some known issues of getting this to import in to a stand-alone project.

## License

[MIT](https://github.com/paulpv/vuetify-number-field/blob/master/LICENSE.md) &copy; [paulpv](https://github.com/paulpv/)

## Install

```bash
yarn add @paulpv/vuetify-number-field
```

or 

```
npm i -s @paulpv/vuetify-number-field
```

CDN: [UNPKG](https://unpkg.com/@paulpv/vuetify-number-field) | [jsDelivr](https://www.jsdelivr.com/package/npm/@paulpv/vuetify-number-field) (available as `window.VNumberField`)

## Usage

```vue
<template>
  <v-number-field
    label="My Number Value"
    v-model.number="myNumberValue"
    >
  </v-number-field>
</template>

<script>
import VNumberField from '@paulpv/vuetify-number-field'

export default {
  components: {
    VNumberField
  },
  data () {
    return {
      myNumberValue: 42
    }
  }
}
</script>
```

Also see https://github.com/paulpv/vuetify-number-field/blob/master/example/App.vue

## TL;DR

I looked and looked for days (seriously) for a simple Vuetify (or Vue) component that only accepted floating point numbers of a specified range before and/or after the decimal.

`<input type="number"...>` (via `<v-text-field type="number"...>`) seems to:

1) not allow controlling the selection/cursor:  
https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange  
This blocks the ability to control the number range before and/or after the decimal.
2) automatically place "step" arrows on the right edge
3) be left justified
4) ignore max/min/maxlength properties
5) (I am sure I am missing a few other limitations/problems)

This results in a control unusable for limiting floating point input.

`input type="text" pattern="[0-9\.]"` only validates the input when it is submitted.

There seems to be a crazy [legacy?] history about `input`'s limitations and why it is so bad.

To make things even weirder, Vuetify rejected even rejected a PR to do this:
* https://github.com/vuetifyjs/vuetify/pull/2235

3rd Party:
* https://github.com/vuejs-tips/v-money
  * https://codesandbox.io/s/38r6wq4mjp  
    Has a blocking bug:  
    https://github.com/vuejs-tips/v-money/issues/44
  * Codepens:  
    https://codepen.io/talski/pen/MOxZXX?editors=1010  
    https://codepen.io/paulpv/pen/oqMeXd  
* https://vuejs-tips.github.io/vue-the-mask/  
  Recommends using [above] v-money  
  Problem is that "mask=###.##" doesn't allow the user to enter "0.1"! They must enter "000.10".  
  https://codesandbox.io/s/rrz0v05ok4  

Vue specific (components only; no directives):
* https://github.com/PDERAS/vue2-moola
* https://github.com/kevinongko/vue-numeric
* https://text-mask.github.io/text-mask/
* https://github.com/text-mask/text-mask/tree/master/addons#createnumbermask
* https://github.com/text-mask/text-mask/blob/master/vue/example/App.vue

"Vue Filter":
* https://stackoverflow.com/questions/43208012/how-do-i-format-currencies-in-a-vue-component
* https://www.npmjs.com/package/vue2-filters

Hand rolled:
* https://jsfiddle.net/crswll/xxuda425/5/
* https://codepen.io/chasebank/pen/OpqmNw?editors=1010

None of these seem to "just work" without some annoying side-effects.

After days of searching I finally gave up looking for an existing component and decided to learn a bit more Vue & Vuetify and write my own.

If you can find an existing component that does precisely what this component does, or better, PLEASE TELL ME ABOUT IT!

### Seed

Originally created via:  
https://github.com/vue-land/create-vue-component

Another option was to try:  
https://github.com/NetanelBasal/vue-generate-component  
But, I didn't like that template's generated output.  
(However, I might revisit this with what I have learned since.)

I tried using:  
https://github.com/vuejs-tips/vue-component-template  
But, that project is over a year old and [relys on `vue build`](https://github.com/vuejs-tips/vue-component-template/blob/master/template/package.json) which was removed [2017/10/01](https://github.com/vuejs/vue-cli/commit/ad2b1917b0986ac1c77c55ea91d3fe9ed8ad0388).

I would prefer to base this repo off of a webpack[-simple] template, but I have been unable to find examples of how to do this or get this to work the way that I want.  
I am all ears if you have any recommendations/suggestions on how to better package this component.

## Support on Beerpay
Hey dude! Help me out for a couple of :beers:!

[![Beerpay](https://beerpay.io/paulpv/vuetify-number-field/badge.svg?style=beer-square)](https://beerpay.io/paulpv/vuetify-number-field)  [![Beerpay](https://beerpay.io/paulpv/vuetify-number-field/make-wish.svg?style=flat-square)](https://beerpay.io/paulpv/vuetify-number-field?focus=wish)
