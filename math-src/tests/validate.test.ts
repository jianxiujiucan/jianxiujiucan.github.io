import { describe, expect, it } from 'vitest'
import {
  emailError,
  isValidEmail,
  isValidPassword,
  isValidUsername,
  normalizeUsername,
  passwordError,
  usernameError,
} from '@/utils/validate'

// 与后端 math-server/tests/validate.test.ts 同一断言表，防前后端规则漂移

describe('isValidUsername（Unicode 文字 + 数字，NFC 后 2~20 个码点）', () => {
  it('合法样本', () => {
    for (const u of [
      'AB',
      'XIAOMING01',
      'A1',
      'ABC123XYZ',
      '0123',
      'a1',
      'xiaoMing01',
      'tt',
      '小明',
      'たろう',
      'カタカナ123',
      '用户01',
      '홍길동',
      'élève01',
      '１２',
      '界'.repeat(20),
      '\u{20BB7}'.repeat(20),
      'がA',
      'が'.repeat(20),
    ]) {
      expect(isValidUsername(u), u).toBe(true)
    }
  })
  it('非法样本', () => {
    for (const u of [
      '',
      'A',
      '小',
      'A_B',
      'A-B',
      'A B',
      '小 明',
      '小　明',
      '小明!',
      '田中・花子',
      '😀😀',
      'A̸B',
      'A'.repeat(21),
      '界'.repeat(21),
      '\u{20BB7}'.repeat(21),
      'が'.repeat(21),
    ]) {
      expect(isValidUsername(u), u).toBe(false)
    }
  })
})

describe('normalizeUsername（NFC）', () => {
  it('统一规范等价形式且保持幂等', () => {
    const normalized = normalizeUsername('が')
    expect(normalized).toBe('が')
    expect(normalizeUsername(normalized)).toBe(normalized)
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
    expect(usernameError('A_B')).toBe('用户名需为 2~20 位文字或数字，不能包含空格或特殊符号')
    expect(usernameError('ABC01')).toBe('')
    expect(usernameError('小明')).toBe('')
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
