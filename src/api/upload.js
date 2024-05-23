import request from '@/request'

// 上传附件
export function fileUpload(data) {
  return request({
    url: '/admin/fileUpload',
    method: 'post',
    data,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}

// 下载附件--解密
export function fileDown(params) {
  return request({
    url: '/admin/fileDown',
    method: 'get',
    params,
    responseType: 'blob',
    headers: {'Content-Type': 'multipart/form-data'}
  })
}

