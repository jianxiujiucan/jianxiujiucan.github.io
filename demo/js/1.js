if (typeof window === 'undefined') {
  console.log(12)
}

const isNode =
  // @ts-expect-error
  typeof process !== "undefined" &&
  // @ts-expect-error
  process.versions != null &&
  // @ts-expect-error
  process.versions.node != null;

  console.log(isNode)