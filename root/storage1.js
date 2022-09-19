class Storage1 {
  init() {
    storage.put("string1", "TEST");
    storage.put("number1", "0");
    storage.put("bool1", "false");
  }

  can_update(data) {
    return blockchain.requireAuth(blockchain.contractOwner(), "active");
  }

  putString(s) {
    storage.put("string1", s);
  }

  getString() {
    return storage.get("string1");
  }

  /**
   * 
   * @param {number} n
   */
  putNumber(n) {
    storage.put("number1", n.toString());
  }

  getNumber() {
    return storage.get("number1");
  }

  /**
   * 
   * @param {bool} b
   */
   putBool(b) {
    storage.put("bool1", b.toString());
  }

  getBool() {
    return storage.get("bool1");
  }
}
module.exports = Storage1;
