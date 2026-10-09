import { describe, expect, it } from 'vitest'
import {
  emailError,
  isValidEmail,
  isValidPassword,
  isValidUsername,
  passwordError,
  usernameError,
} from '@/utils/validate'

// 与后端 math-server/tests/validate.test.ts 同一断言表，防前后端规则漂移

describe('isValidUsername（26 个大写字母 + 数字，2~20 位）', () => {
  it('合法样本', () => {
    for (const u of ['AB', 'XIAOMING01', 'A1', 'ABC123XYZ', '0123']) {
      expect(isValidUsername(u), u).toBe(true)
    }
  })
  it('非法样本', () => {
    for (const u of ['', 'A', 'a1', '小明', 'A_B', 'A-B', 'A B', 'A'.repeat(21)]) {
      expect(isValidUsername(u), u).toBe(false)
    }
  })
})

describe('isValidPassword（8~64 位，仅字母数字，必须同时含两者）', () => {
  it('合法样本', () => {
    for (const p of ['abc12345', 'A1b2C3d4', 'password9', '1234567a', 'a'.repeat(63) + '1']) {
      expect(isValidPassword(p), p).toBe(true)
    }
  })
  it('非法样本', () => {
    for (const p of [
      '',
      'ab1',
      'abcdefgh',
      '12345678',
      'abc1234!',
      'abc 1234',
      'a'.repeat(64) + '1',
    ]) {
      expect(isValidPassword(p), p).toBe(false)
    }
  })
})

describe('isValidEmail', () => {
  it('合法样本', () => {
    for (const e of ['a@b.com', 'test.user+tag@example.com.cn', 'A1@qq.com']) {
      expect(isValidEmail(e), e).toBe(true)
    }
  })
  it('非法样本', () => {
    for (const e of ['', 'a@', '@b.com', 'a b@c.com', 'a@b', 'a@.com']) {
      expect(isValidEmail(e), e).toBe(false)
    }
  })
})

describe('中文字段级错误文案', () => {
  it('usernameError', () => {
    expect(usernameError('')).toBe('请输入用户名')
    expect(usernameError('a')).not.toBe('')
    expect(usernameError('ABC01')).toBe('')
  })
  it('passwordError', () => {
    expect(passwordError('')).toBe('请输入密码')
    expect(passwordError('abc')).toBe('密码至少 8 位')
    expect(passwordError('abcdefgh')).toBe('密码必须同时包含字母和数字')
    expect(passwordError('abc12345')).toBe('')
  })
  it('emailError', () => {
    expect(emailError('')).toBe('请输入邮箱')
    expect(emailError('not-an-email')).toBe('邮箱格式不正确')
    expect(emailError('a@b.com')).toBe('')
  })
})
