// 演示页面api,此js不要修改
import axios from 'axios'

export function getTableList(param) {
  return axios({
    url: 'https://cdn.jsdelivr.net/gh/baimingxuan/media-store/mock-data/table-list.json',
    method: 'get',
    param
  })
}