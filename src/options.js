
let defaultThousandsSeparator
let defaultDecimalSeparator
if (Intl && Intl.NumberFormat) {
  // https://caniuse.com/#feat=internationalization
  const template = new Intl.NumberFormat().format(1234.56)
  defaultThousandsSeparator = template.charAt(1)
  defaultDecimalSeparator = template.charAt(template.length - 3)
} else {
  defaultThousandsSeparator = ','
  defaultDecimalSeparator = '.'
}
// console.log('options example', example, 'thousandsSeparator', thousandsSeparator, 'decimalSeparator', decimalSeparator)

export default {
  prefix: '',
  suffix: '',
  thousandsSeparator: defaultThousandsSeparator,
  decimalSeparator: defaultDecimalSeparator,
  decimalLimit: 2,
  integerLimit: 3
}
