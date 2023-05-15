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
    public id?: string
  ) {}
}
