// 表单验证工具函数

import { VALIDATION_RULES } from '@/constants'

/**
 * 验证工具类
 */
export class Validator {
  /**
   * 验证用户名
   */
  static username(value: string): boolean {
    return VALIDATION_RULES.USERNAME.test(value)
  }

  /**
   * 验证密码
   */
  static password(value: string): boolean {
    return VALIDATION_RULES.PASSWORD.test(value)
  }

  /**
   * 验证邮箱
   */
  static email(value: string): boolean {
    return VALIDATION_RULES.EMAIL.test(value)
  }

  /**
   * 验证手机号
   */
  static phone(value: string): boolean {
    return VALIDATION_RULES.PHONE.test(value)
  }

  /**
   * 验证必填字段
   */
  static required(value: any): boolean {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object') return Object.keys(value).length > 0
    return true
  }

  /**
   * 验证最小长度
   */
  static minLength(value: string, min: number): boolean {
    return value.length >= min
  }

  /**
   * 验证最大长度
   */
  static maxLength(value: string, max: number): boolean {
    return value.length <= max
  }

  /**
   * 验证数字范围
   */
  static range(value: number, min: number, max: number): boolean {
    return value >= min && value <= max
  }

  /**
   * 验证URL
   */
  static url(value: string): boolean {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  /**
   * 验证身份证号
   */
  static idCard(value: string): boolean {
    const pattern = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    return pattern.test(value)
  }

  /**
   * 验证邮政编码
   */
  static zipCode(value: string): boolean {
    return /^[1-9]\d{5}$/.test(value)
  }

  /**
   * 批量验证
   */
  static validate(rules: Record<string, any>, data: Record<string, any>): Record<string, string[]> {
    const errors: Record<string, string[]> = {}

    Object.keys(rules).forEach(key => {
      const fieldRules = rules[key]
      const value = data[key]
      const fieldErrors: string[] = []

      fieldRules.forEach((rule: any) => {
        if (rule.required && !this.required(value)) {
          fieldErrors.push(rule.message || `${key} is required`)
        }

        if (rule.min && typeof value === 'string' && !this.minLength(value, rule.min)) {
          fieldErrors.push(rule.message || `${key} must be at least ${rule.min} characters`)
        }

        if (rule.max && typeof value === 'string' && !this.maxLength(value, rule.max)) {
          fieldErrors.push(rule.message || `${key} must be at most ${rule.max} characters`)
        }

        if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
          fieldErrors.push(rule.message || `${key} format is invalid`)
        }

        if (rule.validator && typeof rule.validator === 'function') {
          const result = rule.validator(value, data)
          if (result !== true) {
            fieldErrors.push(result || `${key} validation failed`)
          }
        }
      })

      if (fieldErrors.length > 0) {
        errors[key] = fieldErrors
      }
    })

    return errors
  }
}

/**
 * 表单验证规则生成器
 */
export const createRules = {
  required(message: string = '此字段为必填项') {
    return { required: true, message, trigger: 'blur' }
  },

  email(message: string = '请输入有效的邮箱地址') {
    return { 
      pattern: VALIDATION_RULES.EMAIL, 
      message, 
      trigger: 'blur' 
    }
  },

  phone(message: string = '请输入有效的手机号码') {
    return { 
      pattern: VALIDATION_RULES.PHONE, 
      message, 
      trigger: 'blur' 
    }
  },

  username(message: string = '用户名格式不正确') {
    return { 
      pattern: VALIDATION_RULES.USERNAME, 
      message, 
      trigger: 'blur' 
    }
  },

  password(message: string = '密码格式不正确') {
    return { 
      pattern: VALIDATION_RULES.PASSWORD, 
      message, 
      trigger: 'blur' 
    }
  },

  minLength(min: number, message?: string) {
    return {
      min,
      message: message || `长度不能少于${min}个字符`,
      trigger: 'blur'
    }
  },

  maxLength(max: number, message?: string) {
    return {
      max,
      message: message || `长度不能超过${max}个字符`,
      trigger: 'blur'
    }
  },

  range(min: number, max: number, message?: string) {
    return {
      validator: (rule: any, value: number) => {
        if (value >= min && value <= max) {
          return true
        }
        return new Error(message || `值必须在${min}到${max}之间`)
      },
      trigger: 'blur'
    }
  }
}

/**
 * 常用的验证规则组合
 */
export const COMMON_RULES = {
  username: [
    createRules.required(),
    createRules.username()
  ],
  
  password: [
    createRules.required(),
    createRules.password()
  ],
  
  email: [
    createRules.required(),
    createRules.email()
  ],
  
  phone: [
    createRules.required(),
    createRules.phone()
  ],
  
  required: [
    createRules.required()
  ]
}

export default Validator