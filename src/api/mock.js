import Mock from 'mockjs'
import student from "@/api/mockServeData/student";
import teacher from "@/api/mockServeData/teacher";
import topic from "@/api/mockServeData/topic";
import permission from "@/api/mockServeData/permission";
// 用户列表的数据
Mock.mock('/api/user/add', 'post', student.createUser)
Mock.mock('/api/user/edit', 'post', student.updateUser)
Mock.mock('/api/user/del', 'post', student.deleteUser)
Mock.mock(/api\/user\/getUser/, student.getUserList)


Mock.mock('/api/teacher/add', 'post', teacher.createTeacher)
Mock.mock('/api/teacher/edit', 'post', teacher.updateTeacher)
Mock.mock('/api/teacher/del', 'post', teacher.deleteTeacher)
Mock.mock(/api\/teacher\/getTeacher/, teacher.getTeacherList)

Mock.mock('/api/topic/add', 'post', topic.createTopic)
Mock.mock('/api/topic/edit', 'post', topic.updateTopic)
Mock.mock('/api/topic/del', 'post', topic.deleteTopic)
Mock.mock(/api\/topic\/getTopic/, topic.getTopicList)


Mock.mock(/api\/permission\/getMenu/, 'post',permission.getMenu)

//引入mockjs
// const Mock = require('mockjs')
// 获取 mock.Random 对象
// const Random = Mock.Random;
//使用mockjs模拟数据
// Mock.mock('api/users/', (req, res) => {//当post或get请求到/api/users/路由时Mock会拦截请求并返回上面的数据
//     var list = [{"url":"http://127.0.0.1:8000/users/3.json","username":"aaaaaa","email":"","groups":[]},{"url":"http://127.0.0.1:8000/users/2.json","username":"somenzz","email":"","groups":[]},{"url":"http://127.0.0.1:8000/users/1.json","username":"admin","email":"admin@example.com","groups":[]}]
//     return list
// })