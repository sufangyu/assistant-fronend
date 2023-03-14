import { ElMessage } from 'element-plus'

/**
 * 复制文本
 *
 * @param {string} text
 */
export const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage({
      type: 'success',
      message: '复制成功',
      duration: 1000
    })
  } catch (error) {
    ElMessage({
      type: 'success',
      message: '复制失败',
      duration: 1000
    })
  }
}
