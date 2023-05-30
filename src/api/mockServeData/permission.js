import Mock from 'mockjs'
export default {
    getMenu: config => {
        const { username, password } = JSON.parse(config.body)
        // 先判断用户是否存在
        // 判断账号和密码是否对应
        if (username === 'admin' && password === 'admin') {
            return {
                code: 20000,
                data: {
                    menu: [
                        {
                            path: '/home',
                            name: 'home',
                            label: '首页',
                            icon: 's-home',
                            url: 'Home.vue'
                        },
                        {
                            path: '/student',
                            name: 'student',
                            label: '学生信息管理',
                            icon: 's-custom',
                            url: 'Student.vue'
                        },
                        {
                            path: '/teacher',
                            name: 'teacher',
                            label: '教师信息管理',
                            icon: 'user',
                            url: 'Teacher.vue'
                        },
                        {
                            label: '论文管理',
                            icon: 'reading',
                            children: [
                                {
                                    path: '/topiclist',
                                    name: 'topiclist',
                                    label: '论文列表',
                                    icon: 'notebook-1',
                                    url: 'TopicList.vue'
                                },
                                {
                                    path: '/page2',
                                    name: 'page2',
                                    label: '页面2',
                                    icon: 'setting',
                                    // url: 'Other/PageTwo'
                                }
                            ]
                        }
                    ],
                    token: Mock.Random.guid(),
                    message: '获取成功'
                }
            }
        } else if (username === 'xiaoxiao' && password === 'xiaoxiao') {
            return {
                code: 20000,
                data: {
                    menu: [
                        {
                            path: '/home',
                            name: 'home',
                            label: '首页',
                            icon: 's-home',
                            url: 'Home.vue'
                        },
                        {
                            label: '论文管理',
                            icon: 'reading',
                            children: [
                                {
                                    path: '/topiclist',
                                    name: 'topiclist',
                                    label: '论文列表',
                                    icon: 'notebook-1',
                                    url: 'TopicList.vue'
                                },
                                {
                                    path: '/page2',
                                    name: 'page2',
                                    label: '页面2',
                                    icon: 'setting',
                                    // url: 'Other/PageTwo'
                                }
                            ]
                        }
                    ],
                    token: Mock.Random.guid(),
                    message: '获取成功'
                }
            }
        } else {
            return {
                code: -999,
                data: {
                    message: '密码错误'
                }
            }
        }

    }
}