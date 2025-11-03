// 日期时间工具函数

import { DATE_FORMATS } from '@/constants'

/**
 * 日期时间工具类
 */
export class DateUtil {
  /**
   * 格式化日期
   */
  static format(date: Date | string | number, format: string = DATE_FORMATS.DEFAULT): string {
    const d = new Date(date)
    
    const map: Record<string, any> = {
      'YYYY': d.getFullYear(),
      'MM': String(d.getMonth() + 1).padStart(2, '0'),
      'DD': String(d.getDate()).padStart(2, '0'),
      'HH': String(d.getHours()).padStart(2, '0'),
      'mm': String(d.getMinutes()).padStart(2, '0'),
      'ss': String(d.getSeconds()).padStart(2, '0'),
      'SSS': String(d.getMilliseconds()).padStart(3, '0'),
      'M': d.getMonth() + 1,
      'D': d.getDate(),
      'H': d.getHours(),
      'm': d.getMinutes(),
      's': d.getSeconds(),
    }

    return format.replace(/YYYY|MM|DD|HH|mm|ss|SSS|M|D|H|m|s/g, (matched) => map[matched])
  }

  /**
   * 获取相对时间（如：刚刚、5分钟前）
   */
  static relativeTime(date: Date | string | number): string {
    const now = new Date()
    const target = new Date(date)
    const diff = now.getTime() - target.getTime()

    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour
    const week = 7 * day
    const month = 30 * day
    const year = 365 * day

    if (diff < minute) {
      return '刚刚'
    } else if (diff < hour) {
      return `${Math.floor(diff / minute)}分钟前`
    } else if (diff < day) {
      return `${Math.floor(diff / hour)}小时前`
    } else if (diff < week) {
      return `${Math.floor(diff / day)}天前`
    } else if (diff < month) {
      return `${Math.floor(diff / week)}周前`
    } else if (diff < year) {
      return `${Math.floor(diff / month)}月前`
    } else {
      return `${Math.floor(diff / year)}年前`
    }
  }

  /**
   * 获取日期范围
   */
  static getDateRange(type: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear'): {
    start: Date
    end: Date
  } {
    const now = new Date()
    
    switch (type) {
      case 'today':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        }

      case 'yesterday':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
          end: new Date(now.getFullYear(), now.getMonth(), now.getDate())
        }

      case 'thisWeek':
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
        startOfWeek.setHours(0, 0, 0, 0)
        
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 7)
        
        return { start: startOfWeek, end: endOfWeek }

      case 'lastWeek':
        const lastWeekStart = new Date(now)
        lastWeekStart.setDate(now.getDate() - now.getDay() - 6)
        lastWeekStart.setHours(0, 0, 0, 0)
        
        const lastWeekEnd = new Date(lastWeekStart)
        lastWeekEnd.setDate(lastWeekStart.getDate() + 7)
        
        return { start: lastWeekStart, end: lastWeekEnd }

      case 'thisMonth':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }

      case 'lastMonth':
        return {
          start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          end: new Date(now.getFullYear(), now.getMonth(), 1)
        }

      case 'thisYear':
        return {
          start: new Date(now.getFullYear(), 0, 1),
          end: new Date(now.getFullYear() + 1, 0, 1)
        }

      case 'lastYear':
        return {
          start: new Date(now.getFullYear() - 1, 0, 1),
          end: new Date(now.getFullYear(), 0, 1)
        }

      default:
        return { start: now, end: now }
    }
  }

  /**
   * 日期加减
   */
  static add(date: Date, amount: number, unit: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'): Date {
    const result = new Date(date)
    
    switch (unit) {
      case 'years':
        result.setFullYear(result.getFullYear() + amount)
        break
      case 'months':
        result.setMonth(result.getMonth() + amount)
        break
      case 'days':
        result.setDate(result.getDate() + amount)
        break
      case 'hours':
        result.setHours(result.getHours() + amount)
        break
      case 'minutes':
        result.setMinutes(result.getMinutes() + amount)
        break
      case 'seconds':
        result.setSeconds(result.getSeconds() + amount)
        break
    }
    
    return result
  }

  /**
   * 计算两个日期的差值
   */
  static diff(date1: Date, date2: Date, unit: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'): number {
    const time1 = date1.getTime()
    const time2 = date2.getTime()
    const diff = Math.abs(time1 - time2)

    switch (unit) {
      case 'years':
        return diff / (365 * 24 * 60 * 60 * 1000)
      case 'months':
        return diff / (30 * 24 * 60 * 60 * 1000)
      case 'days':
        return diff / (24 * 60 * 60 * 1000)
      case 'hours':
        return diff / (60 * 60 * 1000)
      case 'minutes':
        return diff / (60 * 1000)
      case 'seconds':
        return diff / 1000
      default:
        return diff
    }
  }

  /**
   * 检查日期是否在范围内
   */
  static isBetween(date: Date, start: Date, end: Date): boolean {
    const time = date.getTime()
    return time >= start.getTime() && time <= end.getTime()
  }

  /**
   * 获取季度
   */
  static getQuarter(date: Date): number {
    return Math.floor((date.getMonth() + 3) / 3)
  }

  /**
   * 获取季度开始和结束日期
   */
  static getQuarterRange(date: Date): { start: Date; end: Date } {
    const quarter = this.getQuarter(date)
    const year = date.getFullYear()
    
    const startMonth = (quarter - 1) * 3
    const endMonth = startMonth + 3
    
    return {
      start: new Date(year, startMonth, 1),
      end: new Date(year, endMonth, 1)
    }
  }

  /**
   * 获取星期几
   */
  static getDayName(date: Date, short: boolean = false): string {
    const days = short 
      ? ['日', '一', '二', '三', '四', '五', '六']
      : ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    
    return days[date.getDay()]
  }

  /**
   * 获取月份名称
   */
  static getMonthName(date: Date, short: boolean = false): string {
    const months = short
      ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    
    return months[date.getMonth()]
  }

  /**
   * 检查是否为闰年
   */
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }

  /**
   * 获取月份天数
   */
  static getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
  }

  /**
   * 转换为ISO格式
   */
  static toISOString(date: Date): string {
    return date.toISOString()
  }

  /**
   * 从ISO格式解析
   */
  static fromISOString(isoString: string): Date {
    return new Date(isoString)
  }
}

/**
 * 常用的日期格式化函数
 */
export const DateFormats = {
  /**
   * 默认格式：YYYY-MM-DD HH:mm:ss
   */
  default(date: Date | string | number): string {
    return DateUtil.format(date, DATE_FORMATS.DEFAULT)
  },

  /**
   * 日期格式：YYYY-MM-DD
   */
  date(date: Date | string | number): string {
    return DateUtil.format(date, DATE_FORMATS.DATE)
  },

  /**
   * 时间格式：HH:mm:ss
   */
  time(date: Date | string | number): string {
    return DateUtil.format(date, DATE_FORMATS.TIME)
  },

  /**
   * 短日期格式：MM-DD
   */
  shortDate(date: Date | string | number): string {
    return DateUtil.format(date, DATE_FORMATS.SHORT_DATE)
  },

  /**
   * 短时间格式：HH:mm
   */
  shortTime(date: Date | string | number): string {
    return DateUtil.format(date, DATE_FORMATS.SHORT_TIME)
  },

  /**
   * 中文格式：YYYY年MM月DD日
   */
  chinese(date: Date | string | number): string {
    return DateUtil.format(date, DATE_FORMATS.CHINESE)
  },

  /**
   * 中文完整格式：YYYY年MM月DD日 HH时mm分ss秒
   */
  chineseFull(date: Date | string | number): string {
    return DateUtil.format(date, DATE_FORMATS.CHINESE_FULL)
  }
}

export default DateUtil