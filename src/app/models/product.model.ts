export class Product {
  constructor(
    public make: string,
    public model: string,
    public description: string,
    public price: number,
    public stockAmount: number,
    public OS: string,
    public disadvantage: string,
    public screenSize: string,
    public stockCode: string,
    public id?: string,
    public isSelected: boolean = false,
    public quantity: number | undefined = 0,
    public amountToAdd?: number,
    public amountToDecrease?: number
  ) {}
}
