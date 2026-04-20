find src/repositories -name "BankAccountRepository.ts" -o -name "CryptoWalletRepository.ts"
grep -A 10 "class BankAccountRepository" src/repositories/*.ts
grep -A 10 "class CryptoWalletRepository" src/repositories/*.ts
