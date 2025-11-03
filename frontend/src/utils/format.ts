// 数据格式化工具函数

import { DATE_FORMATS } from '@/constants'

/**
 * 格式化工具类
 */
export class Formatter {
  /**
   * 格式化金额
   */
  static currency(value: number, options: {
    currency?: string
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  } = {}): string {
    const {
      currency = 'CNY',
      locale = 'zh-CN',
      minimumFractionDigits = 2,
      maximumFractionDigits = 2
    } = options

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value)
  }

  /**
   * 格式化数字
   */
  static number(value: number, options: {
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  } = {}): string {
    const {
      locale = 'zh-CN',
      minimumFractionDigits = 0,
      maximumFractionDigits = 2
    } = options

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value)
  }

  /**
   * 格式化百分比
   */
  static percent(value: number, options: {
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  } = {}): string {
    const {
      locale = 'zh-CN',
      minimumFractionDigits = 0,
      maximumFractionDigits = 2
    } = options

    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value / 100)
  }

  /**
   * 格式化文件大小
   */
  static fileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  /**
   * 格式化手机号（添加空格）
   */
  static phone(phone: string): string {
    if (!phone) return ''
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
  }

  /**
   * 格式化身份证号（添加空格）
   */
  static idCard(idCard: string): string {
    if (!idCard) return ''
    return idCard.replace(/(\d{6})(\d{8})(\d{4})/, '$1 $2 $3')
  }

  /**
   * 格式化银行卡号（每4位添加空格）
   */
  static bankCard(cardNumber: string): string {
    if (!cardNumber) return ''
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  /**
   * 格式化文本（截断并添加省略号）
   */
  static truncate(text: string, maxLength: number, suffix: string = '...'): string {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + suffix
  }

  /**
   * 首字母大写
   */
  static capitalize(text: string): string {
    if (!text) return ''
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  /**
   * 每个单词首字母大写
   */
  static titleCase(text: string): string {
    if (!text) return ''
    return text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }

  /**
   * 转换为驼峰命名
   */
  static camelCase(text: string): string {
    if (!text) return ''
    return text.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
  }

  /**
   * 转换为蛇形命名
   */
  static snakeCase(text: string): string {
    if (!text) return ''
    return text.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  }

  /**
   * 转换为短横线命名
   */
  static kebabCase(text: string): string {
    if (!text) return ''
    return text.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
  }

  /**
   * 格式化JSON字符串
   */
  static json(data: any, indent: number = 2): string {
    try {
      return JSON.stringify(data, null, indent)
    } catch {
      return ''
    }
  }

  /**
   * 格式化查询参数
   */
  static queryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams()
    
    Object.keys(params).forEach(key => {
      const value = params[key]
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
    
    return searchParams.toString()
  }

  /**
   * 从查询字符串解析参数
   */
  static parseQueryString(queryString: string): Record<string, string> {
    const params: Record<string, string> = {}
    const searchParams = new URLSearchParams(queryString)
    
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    
    return params
  }
}

/**
 * 颜色格式化工具
 */
export class ColorFormatter {
  /**
   * RGB转十六进制
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  /**
   * 十六进制转RGB
   */
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  /**
   * 颜色变亮
   */
  static lighten(hex: string, percent: number): string {
    const rgb = this.hexToRgb(hex)
    if (!rgb) return hex

    const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * percent))
    const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * percent))
    const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * percent))

    return this.rgbToHex(r, g, b)
  }

  /**
   * 颜色变暗
   */
  static darken(hex: string, percent: number): string {
    const rgb = this.hexToRgb(hex)
    if (!rgb) return hex

    const r = Math.max(0, Math.round(rgb.r * (1 - percent)))
    const g = Math.max(0, Math.round(rgb.g * (1 - percent)))
    const b = Math.max(0, Math.round(rgb.b * (1 - percent)))

    return this.rgbToHex(r, g, b)
  }
}

export default Formatter