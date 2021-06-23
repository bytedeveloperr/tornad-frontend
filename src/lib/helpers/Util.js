export class Util {
  static formatToDecimal(value, decimal = 18) {
    return (value / 10 ** decimal).toFixed(8)
  }
}
