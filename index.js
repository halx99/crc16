var bufferFactory = require('buffer-factory');
var crc16Native = require('./build/Release/crc16.node');

var parseParam = function (input, encoding, option) {
  encoding = encoding || 'hex';
  if (typeof encoding === 'object') {
    option = encoding;
    encoding = 'hex';
  }
  option = option || {};

  var buf = (function () {
    if (typeof input === 'string') {
      try {
        input = bufferFactory(input, encoding);
      } catch (e) {
        console.trace(e);
        return null;
      }
    }
    if (Buffer.isBuffer(input) && input.length > 0 && input.byteLength > 0) {
      return input;
    }
    return null;
  })()

  if (buf === null) {
    throw new TypeError('crc16.' + arguments.callee.caller.name + ' input param invalid!');
  }

  return { buf: buf, option: option };
}
var crc16 = {
  /**
   * checkSum
   * @param input string | buffer
   * @param encoding string 'hex' default
   * @param option object
   * @example checkSum('301a', 'hex')
   * @example checkSum('301a')
   * @example checkSum(Buffer.from('301a', 'hex'))
   * @example checkSum('301a', {retType: 'int'}) default retType is hex
   * @return
   *  hex string when option.retType == 'hex'
   *  array when option.retType == 'array'
   *  unsigned short int when option.retType == 'int'
   *  Buffer when option.retType == 'buffer'
   */
  checkSum: function (input, encoding, option) {
    var param = parseParam(input, encoding, option);
    var sum = crc16Native.checkSum(param.buf, param.option);
    /**
     * @TODO
     * option.retType == 'buffer'时，crc16_node.cc会忽略，按retType == 'hex'执行
     * 后续可以直接在node native里直接返回buffer
     */
    if (param.option.retType === 'buffer') {
      return bufferFactory(sum, 'hex');
    }
    return sum;
  },

  /**
   * verifySum
   * @param input string | buffer
   * @param encoding string 'hex' default
   * @param option object
   * @example verifySum('301a947b', 'hex')
   * @example verifySum('301a947b')
   * @example checkSum(Buffer.from('301a947b', 'hex'))
   * @return return bool true | false
   */
  verifySum: function (input, encoding, option) {
    var param = parseParam(input, encoding, option);
    return crc16Native.verifySum(param.buf, param.option);
  }
};

module.exports = crc16;


