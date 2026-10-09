import { describe, expect, it } from 'vitest'
import { generateCode, hashCode } from '../src/code'

describe('generateCode', () => {
  it('1000 次均为 6 位数字串', () => {
    for (let i = 0; i < 1000; i++) {
      expect(generateCode()).toMatch(/^\d{6}$/)
    }
  })
})

describe('hashCode', () => {
  it('确定性：相同输入相同输出', () => {
    expect(hashCode('a@b.com', '123456')).toBe(hashCode('a@b.com', '123456'))
  })
  it('邮箱大小写归一', () => {
    expect(hashCode('A@B.com', '123456')).toBe(hashCode('a@b.com', '123456'))
  })
  it('不同邮箱或不同码输出不同', () => {
    expect(hashCode('a@b.com', '123456')).not.toBe(hashCode('c@d.com', '123456'))
    expect(hashCode('a@b.com', '123456')).not.toBe(hashCode('a@b.com', '654321'))
  })
  it('输出为 64 位十六进制（sha256）', () => {
    expect(hashCode('a@b.com', '123456')).toMatch(/^[0-9a-f]{64}$/)
  })
})
