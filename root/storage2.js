class Storage2 {
  init() {
  }

  can_update(data) {
    return blockchain.requireAuth(blockchain.contractOwner(), "active");
  }

  putString(f, s) {
    storage.mapPut("string2", f, s);
  }

  getString(f) {
    return storage.mapGet("string2", f);
  }

  /**
   * 
   * @param {string} f
   * @param {number} n
   */
  putNumber(f, n) {
    storage.mapPut("number2", f, n.toString());
  }

  getNumber(f) {
    return storage.mapGet("number2", f);
  }

  /**
   * 
   * @param {string} f
   * @param {bool} b
   */
   putBool(f, b) {
    storage.mapPut("bool2", f, b.toString());
  }

  getBool(f) {
    return storage.mapGet("bool2", f);
  }
}
module.exports = Storage2;
