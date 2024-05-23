/**
 * 对象深拷贝
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  return JSON.parse(JSON.stringify(source))
}

/**
 * 获取粘贴时的纯文本
 * @param e
 * @returns {string}
 */
export function getPlainText(e) {
  function uniform(str) {
    const _str = supportIE(str).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const arr = _str.split(/\r\n|\r|\n/)
    if (arr) {
      return arr.map(item => {
        if (item.length > 0) {
          return '<div>' + item + '</div>'
        }
        return '<div><br></div>'
      }).join('')
    }
    return _str
  }
  let innerText = ''
  const TAB = ' '.repeat(2)
  e.preventDefault()
  if (e.clipboardData) {
    innerText = (e.originalEvent || e).clipboardData.getData('text/plain').replace(/\t/g, TAB)
    document.execCommand('insertHtml', false, uniform(innerText))
  } else if (window.clipboardData) {
    innerText = window.clipboardData.getData('Text').replace(/\t/g, TAB)
    if (document.selection) {
      document.selection.createRange().pasteHTML(uniform(innerText))
    } else if (window.getSelection) {
      const sel = window.getSelection()
      const range = sel.getRangeAt(0)
      // 创建临时元素，使得TextRange可以移动到正确的位置
      const tempEl = document.createElement('span')
      tempEl.innerHTML = '&#FEFF;'
      range.deleteContents()
      range.insertNode(tempEl)
      const textRange = document.body.createTextRange()
      textRange.moveToElementText(tempEl)
      tempEl.parentNode.removeChild(tempEl)
      textRange.pasteHTML(uniform(innerText))
      textRange.collapse(false)
      textRange.select()
    }
  }
  return uniform(innerText)
}

/**
 * IE中的p标签转换成div
 * @param str
 * @returns {*}
 */
export function supportIE(str) {
  return str.replace(/<(\/?)p>/g, '<$1div>')
}

/**
 * contenteditable 光标定位到最后
 * @param target
 * */
export function keepCursorEnd(target) {
  // 非IE浏览器
  if (window.getSelection) {
    // 解决Firefox不获取焦点无法定位问题
    target.focus()
    // 创建range对象
    const range = window.getSelection()
    // 选择target下所有子内容
    range.selectAllChildren(target)
    // 光标移至最后
    range.collapseToEnd()
  } else if (document.selection) { // IE浏览器
    // 创建range对象
    const range = document.selection.createRange()
    // 定位到target
    range.moveToElementText(target)
    // 光标移至最后
    range.collapse(false)
    range.select()
  }
}

/**
 * 将base64图片数据转换成Blob
 * @param image
 * @returns {Blob}
 */
export function base64toBlob(image) {
  const bytes = window.atob(image.split(',')[1])
  const array = []
  for (let i = 0; i < bytes.length; i++) {
    array.push(bytes.charCodeAt(i))
  }
  return new Blob([new Uint8Array(array)], { type: 'image/png' })
}

/**
 * 计算图片宽高及比率
 * @param imageTrueW 图片实际宽
 * @param imageTrueH 图片实际高
 * @param showAreaW 展示区宽度
 * @param showAreaH 展示区高度
 * */
export function calcImageSize(imageTrueW, imageTrueH, showAreaW, showAreaH) {
  let [width, height, ratio] = [0, 0, 0]
  // 图片真实宽大于真实高
  if (imageTrueW > imageTrueH) {
    if (imageTrueW >= showAreaW) { // 真实宽大于或等于展示区最大宽
      const imageRatioH = imageTrueH * (showAreaW / imageTrueW)
      // 按展示区最大宽与实际宽比率换算后，高度大于显示高度时
      if (imageRatioH >= showAreaW) {
        width = imageTrueW * (showAreaH / imageTrueH)
        height = showAreaH
        ratio = imageTrueH / showAreaH
      } else {
        width = showAreaW
        height = imageRatioH
        ratio = imageTrueW / showAreaW
      }
    } else {
      width = imageTrueW
      height = imageTrueH
      ratio = 1
    }
  } else { // 图片真实宽小于或等于真实高
    if (imageTrueH >= showAreaH) { // 真实高大于或等于展示区最大高
      width = imageTrueW * (showAreaH / imageTrueH)
      height = showAreaH
      ratio = imageTrueH / showAreaH
    } else {
      width = imageTrueW
      height = imageTrueH
      ratio = 1
    }
  }
  return {
    width,
    height,
    ratio
  }
}
/**
 * @param {Function} fn 防抖函数
 * @param {Number} delay 延迟时间
 */
export function debounce(fn, delay) {
  var timer;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

/**
 * @param {date} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time, fmt) {
  if (!time) return '';
  else {
    const date = new Date(time);
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds(),
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        );
      }
    }
    return fmt;
  }
}

/**
 * 金额转中文
 * 思路：                       
 *                             个
 *      十     百      千       万
 *      十万   百万    千万      亿 
 *      十亿   百亿    千亿      万亿
 *                              
 *                              0
 *      1      2       3        4
 *      5      6       7        8   
 *      9      10      11       12
 * 
 * 计算步骤
 * 1. 获取当前数值大小
 * 2. 排除个位后 数值按个，十，百，千有规律的重复 所以计算其和4的余数 pos % 4
 * 3. 补充最大单位，例如上面第三，四行的万和亿
 *    pos = 0 ~ 3 没有最大单位
 *    pos = 4 ~ 7 最大单位是万
 *    pos = 8 ~ 11 最大单位是亿
 *    pos / 4 的整数就是最大单位
 */
export function getAmountChinese ( val ) {
  const amount = +val
  if ( Number.isNaN( amount ) || amount < 0 ) return ''
  const NUMBER = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const N_UNIT1 = ['', '拾', '佰', '仟']
  const N_UNIT2 = ['', '万', '亿', '万亿']
  const D_UNIT = ['角', '分', '厘', '毫']
  let [integer, decimal] = amount.toString().split( '.' )
  if ( integer && integer.length > 12 ) return '金额过大无法计算'
  let res = ''
  // 整数部分
  if ( integer ) {
    for ( let i = 0, len = integer.length; i < len; i++ ) {
      const num = integer.charAt( i );
      const isZero = num === '0';
      const pos = len - i - 1; // 排除个位后 所处的索引位置
      const isMaxUniPos = pos % 4 === 0;
      const isZeroNext = integer.charAt( i + 1 ) === '0';
      if ( !(isZero && (isZeroNext || isMaxUniPos))) { // 当前位 等于 0 且下一位也等于 0 则可跳过计算
        res += NUMBER[num];
        if (!isZero) res += N_UNIT1[pos % 4];
      }
      if(isMaxUniPos) {
        res += N_UNIT2[Math.floor( pos / 4 )];
      };
    }
    res += '圆'
  }
  // 小数部分
  if ( parseInt( decimal ) ) {
    const loopCount = Math.min(decimal.length, 4);
    for ( let i = 0; i < loopCount; i++ ) {
      const num = decimal.charAt( i )
      if ( num !== '0' ) res += NUMBER[num] + D_UNIT[i];
    }
  } else {
    res += '整'
  }
  return res
}

/**
 * 计算两个时间差经历的时间的文字描述
 * @param {*} timestamp - 毫秒
 */
export const timeCalculate = ( start, end ) => {
  const label = ['分钟', '小时', '天', '月', '年']
  const unit = [60, 60, 24, 30, 12]
  let restTime = Math.floor( ( end - start ) / 1000 )
  let res = ''
  for ( let i = 0, len = unit.length; i < len; i++ ) {
    const pos = len - i // 从年开始算，分钟换算成年 === Math.pow(60, 4)
    const temp = unit.slice( 0, pos ).reduce( ( p, c ) => p * c, 1 )
    const time = Math.floor( restTime / temp )
    time > 0 && ( res += time + label[pos - 1] )
    restTime -= time * temp
  }
  return res
}
/**
 * 下划线转驼峰
 * @param {String} name - 字符串
 */
export const toHump = name => name.replace( /\_(\w)/g, function ( all, letter ) {
  return letter.toUpperCase()
} )
/**
 * 将用户输入的连续单个数字合并为一个数
 * @param {Array} expressions - 记录计算表达式的数组
 * @returns {Array} 新的数组
 */
export const mergeNumberOfExps = expressions => {
  const res = []
  const isNumChar = n => /^[\d|\.]$/.test( n )
  for ( let i = 0; i < expressions.length; i++ ) {
    if ( i > 0 && isNumChar( expressions[i - 1] ) && isNumChar( expressions[i] ) ) {
      res[res.length - 1] += expressions[i]
      continue
    }
    res.push( expressions[i] )
  }
  return res
}
/**
 * 校验表达式是否符合计算法则
 * @param {Array} expressions - 合并数字后的表达式数组
 * @returns {Boolean}
 */
export const validExp = ( expressions, mergeNum = true ) => {
  const temp = mergeNum ? mergeNumberOfExps( expressions ) : expressions
  const arr = temp.filter( t => !'()'.includes( t ) )
  // 去括号后 length应该为奇数  并且第一个字符和最后一个字符应该为数字而非计算符号
  if ( temp.length % 2 === 0 || arr.length % 2 === 0 || Number.isNaN( +arr[0] ) || Number.isNaN( +arr[arr.length - 1] ) ) {
    return false
  }
  for ( let i = 0; i < arr.length - 1; i += 2 ) {
    if ( typeof ( +arr[i] ) !== 'number' || !Number.isNaN( +arr[i + 1] ) ) return false
  }
  return true
}

/**
 * 中缀转后缀（逆波兰 Reverse Polish Notation）
 * @param {Array} exps - 中缀表达式数组
 */
export const toRPN = exps => {
  const s1 = [] // 符号栈
  const s2 = [] // 输出栈
  const getTopVal = ( stack ) => stack.length > 0 ? stack[stack.length - 1] : null
  const levelCompare = ( c1, c2 ) => {
    const getIndex = c => ['+-', '×÷', '()'].findIndex( t => t.includes( c ) )
    return getIndex( c1 ) - getIndex( c2 )
  }
  exps.forEach( t => {
    if ( typeof t === 'string' && Number.isNaN( Number( t ) ) ) { // 是符号
      if ( t === '(' ) {
        s1.push( t )
      } else if ( t === ')' ) {
        let popVal
        do {
          popVal = s1.pop()
          popVal !== '(' && s2.push( popVal )
        } while ( s1.length && popVal !== '(' )
      } else {
        let topVal = getTopVal( s1 )
        if ( !topVal ) { // s1 为空 直接push
          s1.push( t )
        } else {
          while ( topVal && topVal !== '(' && levelCompare( topVal, t ) >= 0 ) { // 优先级 >= t 弹出到s2
            s2.push( s1.pop() )
            topVal = getTopVal( s1 )
          }
          s1.push( t )
        }
      }
      return
    }
    s2.push( t ) // 数字直接入栈
  } )
  while ( s1.length ) {
    s2.push( s1.pop() )
  }
  return s2
}
/**
 * 计算后缀表达式的值
 * @param {Array} rpnExps - 后缀表达式
 */
export const calcRPN = rpnExps => {
  rpnExps = rpnExps.concat()
  const calc = ( x, y, type ) => {
    let a1 = Number( x ), a2 = Number( y )
    switch ( type ) {
      case '+': return a1 + a2;
      case '-': return a1 - a2;
      case '×': return a1 * a2;
      case '÷': return a1 / a2;
    }
  }
  for ( let i = 2; i < rpnExps.length; i++ ) {
    if ( '+-×÷'.includes( rpnExps[i] ) ) {
      let val = calc( rpnExps[i - 2], rpnExps[i - 1], rpnExps[i] )
      rpnExps.splice( i - 2, 3, val )
      i = i - 2
    }
  }
  return rpnExps[0]
}