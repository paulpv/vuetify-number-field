
// Styles
import 'vuetify/src/stylus/components/_input-groups.styl'
import 'vuetify/src/stylus/components/_text-fields.styl'

// Mixins
import Colorable from 'vuetify/es5/mixins/colorable'
import Input from 'vuetify/es5/mixins/input'

import defaults from './options'

export default {
  name: 'v-number-field',

  mixins: [
    Colorable,
    Input
  ],

  inheritAttrs: false,

  data () {
    return {
      initialValue: null,
      internalChange: false,
      badInput: false
    }
  },

  props: {
    autofocus: Boolean,
    box: Boolean,
    clearable: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    fullWidth: Boolean,
    placeholder: String,

    prefix: {
      type: String,
      default: () => defaults.prefix
    },
    suffix: {
      type: String,
      default: () => defaults.suffix
    },
    decimalSeparator: {
      type: String,
      default: () => defaults.decimalSeparator
    },
    thousandsSeparator: {
      type: String,
      default: () => defaults.thousandsSeparator
    },
    integerLimit: {
      type: Number,
      default: () => defaults.integerLimit
    },
    decimalLimit: {
      type: Number,
      default: () => defaults.decimalLimit
    }
  },

  computed: {
    classes () {
      const classes = {
        'input-group--text-field': true,
        'input-group--text-field-box': this.box,
        'input-group--full-width': this.fullWidth,
        'input-group--prefix': this.prefix,
        'input-group--suffix': this.suffix
      }

      if (this.hasError) {
        classes['error--text'] = true
      } else {
        return this.addTextColorClassChecks(classes)
      }

      return classes
    },
    inputValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        // console.log('inputValue set val', val)
        this.lazyValue = val
        this.$emit('input', this.lazyValue)
      }
    },
    isDirty () {
      return (this.lazyValue != null && this.lazyValue.toString().length > 0) ||
        this.badInput
    }
  },

  watch: {
    isFocused (val) {
      // console.log('watch isFocused val', val)
      if (val) {
        this.initialValue = this.lazyValue
      } else {
        if (this.initialValue !== this.lazyValue) {
          this.$emit('change', this.lazyValue)
        }
      }
    },
    value: {
      handler (newValue, oldValue) {
        // console.log('watch value newValue', newValue)
        if (this.internalChange) {
          // console.log('watch value internal change')
          this.lazyValue = newValue
          this.internalChange = false
        } else {
          // console.log('watch value external change')
          const parsed = this._parse('watch value', newValue)
          // console.log('watch value parsed', JSON.stringify(parsed))
          const cleaned = parsed.cleaned
          this.lazyValue = cleaned

          // Emit when the externally set value was modified internally
          if (String(newValue) !== this.lazyValue) {
            // console.log('watch value changed')
            this.$nextTick(() => {
              this.$refs.input.value = cleaned
              this.$emit('input', this.lazyValue)
            })
          } else {
            // console.log('watch value unchanged')
          }
        }

        if (!this.validateOnBlur) {
          this.validate()
        }
      }
    }
  },

  mounted () {
    // console.log('mounted')
    if (this.autofocus) {
      this.focus()
    }
  },

  methods: {
    regexEscape (value) {
      // Per https://stackoverflow.com/a/3561711/252308
      return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    },
    // eslint-disable-next-line max-statements
    _parse (caller, value) {
      // console.log('_parser caller', caller, 'value', value)

      value = (value === null || value === undefined) ? '' : value.toString().trim()

      const original = value

      const {
        integerLimit,
        decimalLimit,
        thousandsSeparator,
        decimalSeparator
      } = this.$props

      const escapedDecimalSeparator = this.regexEscape(decimalSeparator)

      let regexpNonNumericCharacters
      if (integerLimit > 3) {
        const escapedThousandsSeparator = this.regexEscape(thousandsSeparator)

        const regexpDuplicateThousandsSeparator = new RegExp(escapedThousandsSeparator + escapedThousandsSeparator + '+', 'g')
        // console.log('_clean regexpDuplicateThousandsSeparator', regexpDuplicateThousandsSeparator)
        value = value.replace(regexpDuplicateThousandsSeparator, thousandsSeparator)
        // console.log('_clean value', value)

        regexpNonNumericCharacters = new RegExp('[^0-9' + escapedThousandsSeparator + escapedDecimalSeparator + ']', 'g')
      } else {
        regexpNonNumericCharacters = new RegExp('[^0-9' + escapedDecimalSeparator + ']', 'g')
      }
      // console.log('_clean regexpNonNumericCharacters', regexpNonNumericCharacters)

      const regexpDuplicateDecimalSeparator = new RegExp(escapedDecimalSeparator + escapedDecimalSeparator + '+', 'g')
      // console.log('_clean regexpDuplicateDecimalSeparator', regexpDuplicateDecimalSeparator)

      value = value.replace(regexpNonNumericCharacters, '')
      // console.log('_clean value', value)

      value = value.replace(regexpDuplicateDecimalSeparator, decimalSeparator)
      // console.log('_clean value', value)

      const parts = value.split(decimalSeparator)
      // console.log('_clean parts', parts)
      const integerPart = parts[0]
      const integerLength = integerPart.length
      let cleaned = integerPart
      let decimalPart = ''
      let containsDecimal
      if (parts.length > 1) {
        containsDecimal = true
        cleaned += decimalSeparator
        for (let i = 1; i < parts.length; i++) {
          const part = parts[i]
          if (part.length) {
            decimalPart += part
          }
        }
        cleaned += decimalPart
      } else {
        containsDecimal = false
      }
      // console.log('_parse cleaned', cleaned)
      const decimalLength = decimalPart.length

      return {
        original,
        cleaned,
        integerLimit,
        decimalLimit,
        thousandsSeparator,
        decimalSeparator,
        integerPart,
        integerLength,
        containsDecimal,
        decimalPart,
        decimalLength
      }
    },
    cancelEvent (e, value) {
      // console.warn('cancelEvent')
      if (value !== undefined) {
        this.$nextTick(() => {
          this.$refs.input.value = value
        })
      }
      e.preventDefault()
    },
    onInput (e) {
      // console.log('onInput e', e)
      const target = e.target
      let targetValue = target.value

      const key = e.data
      // console.log('onInput e.data', key, 'e.target.value', targetValue)
      let selectionStart = target.selectionStart
      // let selectionEnd = target.selectionEnd
      // console.log('onInput selectionStart', selectionStart, 'selectionEnd', selectionEnd)
      // console.log('onInput this.value', this.value, 'this.lazyValue', this.lazyValue, typeof this.lazyValue)

      const valueOld = this.lazyValue
      // console.log('onInput valueOld', valueOld)
      // const selection = this.selection
      // console.log('onInput this.selection', selection, 'this.lazySelection', this.lazySelection)

      const parsed = this._parse('onInput', targetValue)
      // console.log('onInput parsed', JSON.stringify(parsed))
      const valueNew = parsed.cleaned
      // console.log('onInput valueNew', valueNew)

      if (valueNew.length) {
        // console.log('onInput A')
        if (parsed.containsDecimal && selectionStart > parsed.integerLength) {
          // console.log('onInput A.A')
          // console.log('onInput decimal part')
          if (parsed.decimalLength > parsed.decimalLimit) {
            // console.log('onInput A.A.A')
            this.cancelEvent(e, valueOld)
            return
          } else {
            // console.log('onInput A.A.B')
          }
        } else {
          // console.log('onInput A.B')
          // console.log('onInput integer part')
          if (parsed.integerLength > parsed.integerLimit) {
            // console.log('onInput A.B.A')
            if (key !== parsed.decimalSeparator) {
              // console.log('onInput A.B.A.A')
              this.cancelEvent(e, valueOld)
              return
            } else {
              // console.log('onInput A.B.A.B')
            }
          } else {
            // console.log('onInput A.B.B')
          }
        }
      } else {
        // console.log('onInput B')
        if (parsed.original.length) {
          // console.log('onInput B.A')
          //
          // The new value couldn't be parsed to a number; restore valueOld
          //
          this.cancelEvent(e, valueOld)
          return
        } else {
          // console.log('onInput B.B')
        }
      }

      if (valueNew === valueOld) {
        // console.log('onInput unchanged')
        this.cancelEvent(e, valueOld)
        return
      } else {
        // console.log('onInput changed')
      }

      this.inputValue = valueNew
      this.badInput = target.validity && target.validity.badInput
    },
    blur (e) {
      // console.log('blur e', e)
      this.isFocused = false
      // Reset internalChange state
      // to allow external change
      // to persist
      this.internalChange = false

      this.$nextTick(() => {
        this.validate()
      })
      this.$emit('blur', e)
    },
    focus (e) {
      // console.log('focus e', e)
      if (!this.$refs.input) return

      this.isFocused = true
      if (document.activeElement !== this.$refs.input) {
        this.$refs.input.focus()
      }
      this.$emit('focus', e)
    },
    keyDown (e) {
      // console.log('keyDown e', e)
      this.internalChange = true
    },
    genInput () {
      // console.log('genInput')
      const tag = 'input'
      const listeners = Object.assign({}, this.$listeners)
      delete listeners['change'] // Change should not be bound externally

      const value = this._parse('genInput', this.lazyValue).cleaned
      // console.log('getInput value', value)

      const data = {
        style: {
          textAlign: 'right'
        },
        domProps: {
          value
        },
        attrs: {
          ...this.$attrs,
          autofocus: this.autofocus,
          disabled: this.disabled,
          required: this.required,
          readonly: this.readonly,
          tabindex: this.tabindex,
          'aria-label': (!this.$attrs || !this.$attrs.id) && this.label // Label `for` will be set if we have an id
        },
        on: Object.assign(listeners, {
          blur: this.blur,
          input: this.onInput,
          focus: this.focus,
          keydown: this.keyDown
        }),
        ref: 'input'
      }

      if (this.placeholder) data.attrs.placeholder = this.placeholder

      data.attrs.type = 'text'
      data.attrs.inputmode = 'decimal'

      const children = [this.$createElement(tag, data)]

      this.prefix && children.unshift(this.genFix('prefix'))
      this.suffix && children.push(this.genFix('suffix'))

      return children
    },
    genFix (type) {
      // console.log('genFix type', type)
      return this.$createElement('span', {
        'class': `input-group--text-field__${type}`
      }, this[type])
    },
    clearableCallback () {
      // console.log('clearableCallback')
      this.inputValue = null
      this.$nextTick(() => this.$refs.input.focus())
    }
  },

  render () {
    // console.log('render arguments', arguments)
    return this.genInputGroup(this.genInput(), { attrs: { tabindex: false } })
  }
}
