class Counter {
  init() {}
   count() {
      value = value + 1
      Storage.put("count", value);
   }
   getValue() {
      return Storage.get("count");
   }
}
module.exports = Counter;
