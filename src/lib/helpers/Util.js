export class Util {
  static formatToDecimal(value, decimal = 18, dp = 2) {
    const res = value / 10 ** decimal
    if (res.toString().includes(".")) {
      return res
    }

    return res.toFixed(dp)
  }
}
