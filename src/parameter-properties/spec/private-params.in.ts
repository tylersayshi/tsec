class BankAccount {
  constructor(private balance: number, private accountNumber: string) {}

  getBalance(): number {
    return this.balance;
  }

  getAccountNumber(): string {
    return this.accountNumber;
  }
}
