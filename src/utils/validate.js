/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
export function isvalidUsername(str) {
  const valid_map = ['admin', 'test']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 手机号验证
 * @param str
 * @returns {boolean}
 */
export function isPhone(str) {
  const reg = /^(0|86|17951)?(1)[0-9]{10}$/;
  return reg.test(str);
}

/**
 * 座机号码
 * @param str
 * @returns {boolean}
 */
export function isMobile(str) {
  // const reg = /^\d{3,4}([\-]{1})?\d{7,8}$/;
  // const reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
  const reg = /^[0][1-9]{2,3}-[0-9]{5,10}$/;
  return reg.test(str);
}


/**
 * 大写，数字
 * @param str
 * @returns {boolean}
 */
export function isValidOne(str) {
  const reg = /^[A-Z\d]+$/;
  console.log(reg.test(str));
  return reg.test(str);
}
/**
 * 大写，小写，中文，数字，;(英文分号)
 * @param str
 * @returns {boolean}
 */
export function isValidThree(str) {
  const reg = /^[A-Za-z0-9\u4E00-\uFA29;]+$/;
  return reg.test(str);
}
/**
 * 大写，小写，数字
 * @param str
 * @returns {boolean}
 */
export function isValidFour(str) {
  const reg = /^[A-Za-z0-9]+$/;
  return reg.test(str);
}

/**
 * 座机号码和手机号码
 * @param str
 * @returns {boolean}
 */
export function isMobilePhone(str) {
  if (isPhone(str) || isMobile(str)) {
    return true;
  }
  return false;
}

/**
 * 验证手机号或座机号
 * @param rule 当前规则对象
 * @param value 当前值
 * @param callback 回调
 * @param required 是否必须，true:必输，false:非必输
 * @param array 数组长度
 */
export function validateMobilePhone(rule, value, callback, required, array) {
  if (required) {
    if (!value) {
      callback(new Error(array[0] + '不能为空！'));
    }
  }
  if (value) {
    if (!isMobilePhone(value)) {
      callback(new Error('格式错误！'));
    } else {
      callback();
    }
  } else {
    callback();
  }
}


/**
 * 判断是否为大写，小写，数字
 */
export function validateFour(rule, value, callback) {
  if (!value) {
    return callback(new Error('不能为空'));
  }

  if (value) {
    if (!isValidFour(value)) {
      callback(new Error('格式错误！'));
    } else {
      callback();
    }
  } else {
    callback();
  }
}

/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (val instanceof Array) {
    if (val.length == 0) return true;
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true;
  } else {
    if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true;
    return false;
  }
  return false;

};
/**
 * 邮箱验证
 * @param str
 * @returns {boolean}
 */
export function isEmail(str) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(str);
}

export function validateEmail(rule, value, callback, required, array) {
  if (required) {
    if (!value) {
      callback(new Error(array[0] + '不能为空！'));
    }
  }
  if (value) {
    if (!isEmail(value)) {
      callback(new Error('格式错误！'));
    } else {
      callback();
    }
  } else {
    callback();
  }
}

/**
 * 验证身份证
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function validateSfz(rule, value, callback) {
  if (!value) {
    return callback(new Error('不能为空'));
  }
  /* eslint-disable */
  function validataCredentials(num) {
    var msg, boo; //  msg身份证验证友情提示,boo返回值
    var num = num.toUpperCase(); // 身份证为末尾可能是X
    //   身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，
    //   最后一位是校验位，可能为数字或字符X。
    const arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    const arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    var nTemp = 0,
      i;
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
      //  输入的身份证号长度不对，或者号码不符合规定;
      return [boo = false, msg = '输入长度不对，或者号码不符合规定'];
    }
    //   校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //   下面分别分析出生日期和校验位
    var len, re;
    len = num.length;
    if (len == 15) {
      re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
      var arrSplit = num.match(re);
      //   检查生日日期是否正确
      var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
      var bGoodDay;
      bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
      if (!bGoodDay) {
        //   输入的身份证号里出生日期不对！
        return [boo = false, msg = '输入的身份证号里出生日期不对！'];
      } else {
        //   将15位身份证转成18位
        //   校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
        for (i = 0; i < 17; i++) {
          nTemp += num.substr(i, 1) * arrInt[i];
        }
        num += arrCh[nTemp % 11];
        return [boo = true, msg = num];
      }
    }
    if (len == 18) {
      re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
      var arrSplit = num.match(re);
      //  检查生日日期是否正确
      var dtmBirth = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
      var bGoodDay;
      bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
      if (!bGoodDay) {
        //  输入的身份证号里出生日期不对！

        return [boo = false, msg = ' 输入的身份证号里出生日期不对'];
      } else {
        //  检验18位身份证的校验码是否正确。
        //  校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        var valnum;
        for (i = 0; i < 17; i++) {
          nTemp += num.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[nTemp % 11];
        if (valnum != num.substr(17, 1)) {
          //  18位身份证的校验码不正确！
          return [boo = false, msg = '身份证的校验码不正确！'];
        }
        return [boo = true, msg = '验证成功'];
      }
    }
    return [boo = false, msg = '身份证的长度不正确！'];
  }
  var res = validataCredentials(value);
  if (!res[0]) {
    callback(new Error(res[1]));
  } else {
    callback();
  }
  /* eslint-enable */
}


/**
 * 密码验证
 * @param str
 * @returns {boolean}
 */
 export function isPassword(str) {
  const reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,20}$/;
  return reg.test(str);
}
/**
 * 验证密码
 * @param rule  验证
 * @param value 值
 * @param callback
 * @param required  是否必填
 * @param array  其它描述
 * @returns {*}
 */
export function validatePassword(rule, value, callback, required, array) {
  if (required) {
    if (!value) {
      callback(new Error(array[0] + '不能为空！'));
    }
  }
  if (value) {
    if (!isPassword(value)) {
      callback(new Error('8-20位，包括数字、字母、特殊字符任意两种！'));
    } else {
      callback();
    }
  } else {
    callback();
  }
}