/**
 * 数组操作工具
 */

export const remove = <T>(arr: T[], item: T): T | undefined => {
  const index = arr.indexOf(item)
  if (index > -1) {
    return arr.splice(index, 1)[0]
  }
  return undefined
}
