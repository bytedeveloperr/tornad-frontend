export class Util {
  static formatToDecimal(value, decimal) {
    return (value / 10 ** decimal).toFixed(4)
  }
}
