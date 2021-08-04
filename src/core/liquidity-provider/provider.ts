export interface IProvider {
  currency: string
  isEnabled(): Promise<boolean>

  /**
   * Checks the availability of liquidity for the given amount
   * @method checkLiquidity
   * @param  amount          amount in provider currency
   * @return                 Liquidity object or null if has not availability
   */
  checkLiquidity(amount: number): Promise<Liquidity>
}
