/**
 * 常用方法
 */
const basic = {};


// 获取年龄
basic.getAge = (strBirthday) => {
  let returnAge;
  // eslint-disable-next-line one-var
  const strBirthdayArr = strBirthday.split('-'),
    birthYear = strBirthdayArr[0],
    birthMonth = strBirthdayArr[1],
    birthDay = strBirthdayArr[2],
    d = new Date(),
    nowYear = d.getFullYear(),
    nowMonth = d.getMonth() + 1,
    nowDay = d.getDate();
  if (nowYear == birthYear) {
    returnAge = 0; // 同年 则为0周岁
  } else {
    const ageDiff = nowYear - birthYear; // 年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        const dayDiff = nowDay - birthDay; // 日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      } else {
        const monthDiff = nowMonth - birthMonth; // 月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      }
    } else {
      returnAge = -1; // 返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge; // 返回周岁年龄
};

// 根据身份证获取生日
basic.getBirthdayFromIdCard = (idCard) => {
  let birthday = '';
  if (idCard != null && idCard != '') {
    if (idCard.length == 15) {
      birthday = '19' + idCard.substr(6, 6);
    } else if (idCard.length == 18) {
      birthday = idCard.substr(6, 8);
    }
    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-');
  }
  return birthday;
};

// 根据身份证获取性别
basic.getSex = (idNo) => {
  if (!idNo) return;
  let sex = '';
  const flag = parseInt(idNo.substring(16, 17)) % 2;
  sex = flag == 0 ? '0' : '1';
  return sex;
};


/**
 * @description 获取需要的时间格式
 * @param {Date} time 时间、时间字符串、时间戳
 * @param {String} format 时间格式，默认'YYYY-MM-DD'。如果是'星期WW'，则返回（如：'星期日'）
 * @return {String} 格式化后的时间
 */
basic.format = function (time, format) {
  time = time ? new Date(time) : new Date();
  format = format || 'YYYY-MM-DD';

  function tf(i) {
    return (i < 10 ? '0' : '') + i;
  }

  return format.replace(/YYYY|MM|DD|hh|mm|ss|WW/g, function (a) {
    switch (a) {
      case 'YYYY':
        return tf(time.getFullYear());
      case 'MM':
        return tf(time.getMonth() + 1);
      case 'DD':
        return tf(time.getDate());
      case 'mm':
        return tf(time.getMinutes());
      case 'hh':
        return tf(time.getHours());
      case 'ss':
        return tf(time.getSeconds());
      case 'WW':
        return ['日', '一', '二', '三', '四', '五', '六'][time.getDay()];
    }
  });
};

/**
 * @description 时间比较大小
 * @param beginTime
 * @param endTime
 */
basic.compareDatetime = function (beginTime, endTime, isEqualSign = true) {
  if (isEqualSign) {
    if ((new Date(beginTime).getTime()) > (new Date(endTime).getTime())) {
      return false;
    }
  } else {
    if ((new Date(beginTime).getTime()) > (new Date(endTime).getTime())) {
      return false;
    }
  }
  return true;
};

/**
 * @description 两个时间之间相差多少天
 * @param {Date} date1
 * @param {Date} date2
 * @param {boolean} isDate 判断格式 ，默认‘年月日’
 * @return {Number}
 */
basic.howManyDays = function (date1, date2, isDateTime = false) {
  let ret = 0;
  if (!isDateTime) {
    date1 = basic.format(date1);
    date2 = basic.format(date2);
  }
  const timestamp1 = Date.parse(date1);
  const timestamp2 = Date.parse(date2);
  const dateSpan = Math.abs(timestamp2 - timestamp1);
  ret = Math.floor(dateSpan / (24 * 3600 * 1000));
  ret = ret + 1;
  return ret;
};

/**
 * @description 两个时间之间相差多少月
 * @param {Date} time1
 * @param {Date} time2
 * @return {Number}
 */
basic.howManyMonths = function (time1, time2) {
  var ret = 0,
    months1, months2;

  time1 = time1 ? new Date(time1) : new Date();
  time2 = time2 ? new Date(time2) : new Date();

  months1 = time1.getFullYear() * 12 + time1.getMonth() + 1;
  months2 = time2.getFullYear() * 12 + time2.getMonth() + 1;
  ret = Math.abs(months1 - months2);
  return ret;
};


/**
 * @description 金额 进行千位分隔符
 * @param {*} number 
 * @return {String}
 */
basic.formatWithRege = function (number) {
  return !(number + '').includes('.')
    ? // 就是说1-3位后面一定要匹配3位
      (number + '').replace(/\d{1,3}(?=(\d{3})+$)/g, (match) => {
        return match + ',';
      })
    : (number + '').replace(/\d{1,3}(?=(\d{3})+(\.))/g, (match) => {
        return match + ',';
      });
}









export default basic;
