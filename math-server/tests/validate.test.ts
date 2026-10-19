import { describe, expect, it } from 'vitest'
import {
  isValidConfig,
  isValidEmail,
  isValidPassword,
  isValidUsername,
  normalizeUsername,
} from '../src/validate'

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
      'ab1', // 太短
      'abcdefgh', // 无数字
      '12345678', // 无字母
      'abc1234!', // 特殊字符
      'abc 1234', // 空格
      'a'.repeat(64) + '1', // 超过 64 位
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

describe('isValidConfig（答题配置白名单）', () => {
  it('合法配置', () => {
    expect(isValidConfig({ count: 10, opType: 'add', range: 20, operands: 2, carry: false })).toBe(true)
    expect(isValidConfig({ count: 100, opType: 'muldiv', range: 100, operands: 3, carry: true })).toBe(true)
  })
  it('非法配置', () => {
    expect(isValidConfig(null)).toBe(false)
    expect(isValidConfig({ count: 11, opType: 'add', range: 20, operands: 2, carry: false })).toBe(false)
    expect(isValidConfig({ count: 10, opType: 'pow', range: 20, operands: 2, carry: false })).toBe(false)
    expect(isValidConfig({ count: 10, opType: 'add', range: 50, operands: 2, carry: false })).toBe(false)
    expect(isValidConfig({ count: 10, opType: 'add', range: 20, operands: 4, carry: false })).toBe(false)
    expect(isValidConfig({ count: 10, opType: 'add', range: 20, operands: 2, carry: 1 })).toBe(false)
  })
})
