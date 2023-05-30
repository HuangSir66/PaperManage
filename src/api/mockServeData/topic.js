import Mock from 'mockjs'
import {title} from "mockjs/src/mock/random/text";

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj (url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
        '"}'
    )
}

let List = []
const count = 200

for (let i = 0; i < count; i++) {
    List.push(
        Mock.mock({
            id: Mock.Random.guid(),
            title: Mock.Random.ctitle(4, 5),
            teacherName:Mock.Random.cname(),
            maxNum: Mock.Random.integer(1, 20),
            num: Mock.Random.integer(1, 20),
            topicDirect: Mock.Random.ctitle(4, 10),

        })
    )
}

export default {
    /**
     * 获取列表
     * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
     * @return {{code: number, count: number, data: *[]}}
     * @param config
     */
    getTopicList: config => {
        console.log(config, 'config')
        const { title, page = 1, limit = 20 } = param2Obj(config.url)
        console.log('title:' + title, 'page:' + page, '分页大小limit:' + limit)
        const mockList = List.filter(topic => {
            if (title && topic.title.indexOf(title) === -1) return false
            return true
        })
        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
        return {
            code: 20000,
            count: mockList.length,
            list: pageList
        }
    },
    /**
     * 增加用户
     * @return {{code: number, data: {message: string}}}
     * @param config
     */
    createTopic: config => {
        const { title,teacherName, maxNum, num,topicDirect} = JSON.parse(config.body)
        console.log(JSON.parse(config.body),'11')
        List.unshift({
            id: Mock.Random.guid(),
            title: title,
            teacherName: teacherName,
            maxNum: maxNum,
            num:num,
            topicDirect:topicDirect,
        })
        return {
            code: 20000,
            data: {
                message: '添加成功'
            }
        }
    },
    /**
     * 删除用户
     * @return {*}
     * @param config
     */
    deleteTopic: config => {
        const { id } = JSON.parse(config.body)
        if (!id) {
            return {
                code: -999,
                message: '参数不正确'
            }
        } else {
            List = List.filter(u => u.id !== id)
            return {
                code: 20000,
                message: '删除成功'
            }
        }
    },
    /**
     * 批量删除
     * @param config
     * @return {{code: number, data: {message: string}}}
     */
    batchremove: config => {
        let { ids } = param2Obj(config.url)
        ids = ids.split(',')
        List = List.filter(u => !ids.includes(u.id))
        return {
            code: 20000,
            data: {
                message: '批量删除成功'
            }
        }
    },
    /**
     * 修改用户
     * @return {{code: number, data: {message: string}}}
     * @param config
     */
    updateTopic: config => {
        const { id,title,teacherName, maxNum, num,topicDirect } = JSON.parse(config.body)
        List.some(u => {
            if (u.id === id) {
                u.title = title
                u.teacherName = teacherName
                u.maxNum = maxNum
                u.num = num
                u.topicDirect=topicDirect
                return true
            }
        })
        return {
            code: 20000,
            data: {
                message: '编辑成功'
            }
        }
    }
}