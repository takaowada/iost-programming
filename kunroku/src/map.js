const tokens = [
  {
    tokenSymbol: "iost",
    tokenName: "IOST",
    tokenContract: "tokne.iost"
  },
  {
    tokenSymbol: "husd",
    tokenName: "IOST-Peg HUSD Token",
    tokenContract: "",
    issuer:"Contract3zCNX76rb3LkiAamGxCgBRCNn6C5fXJLaPPhZu2kagY3"
  },
  {
    tokenSymbol: "lol",
    tokenName: "LOL",
    tokenContract: "",
  },
  {
    tokenSymbol: "abct",
    tokenName: "iostabc token",
    tokenContract: "",
  }
];

tokens.map((p, i) => console.log("p", p))

console.log("before tokens", tokens);

const newTokens = tokens.filter(item => item.tokenSymbol !== "iost");

console.log("after tokens", newTokens);

const accountItems = [
  {
    accountName: "alice",
    secKey: "HPnQJ6haPGMA6eyjuAkWdEYdxtX9n7nwxvtPLVhMaoJBExvambgXNVLC4B2QjkH8PVKrEmK3v6jNmRokgaXRZQW",
    pubKey: "8shqMi5xAQmYwVKY1EPbGdgwEVEAdw6zER51VkrQbLVp",
    network: "LOCALNET"
  },
  {
    accountName: "bobby",
    secKey: "2wXNZYHN2VfwYLKPechxBJ3ApmqxKcZmXA7nX3VB2nWxeyG1zKWkgWNN16AGvhiQj11mpaGo2jfDzig6JXECJW5D",
    pubKey: "AsFVwuQPZUEnkv3yUiFFdzDX2YbiQDrPk6e1pK4bChAX",
    network: "LOCALNET"
  }
];

const accountName = "bobby";
const network = "LOCALNET";

console.log("accountName", accountName);
console.log("network", network);
const accounts = accountItems.filter(item => item.accountName !== accountName || item.network !== network);
//const accounts = accountItems.filter(item => console.log(item.network, network));
//const accounts = accountItems.filter(item => item.accountName !== accountName);
console.log("accounts", accounts);



