import http from '../utils/request'
export const getUser = (params) => {
    console.log(params, 'params')
    // 返回用户列表
    // return http.get('/user/getUser', params)
    return http.get('/student', params)
}

export const addUser = (data) => {
    // return http.post('/user/add', data)
    return http.post('/student/', data)
}

export const editUser = (data) => {
    // return http.post('/user/edit', data)
    return http.put(`/student/${data.id}/`, data)
}

export const delUser = (data) => {
    // return http.post('/user/del', data)
    return http.delete(`/student/${data.id}`, data)

}


export const getTeacher = (params) => {
    console.log(params, 'params')
    // 返回用户列表
    return http.get('/teacher/', params)
}
// export const getOneTeacher = (params) =>{
//     return http.get(`/teacher/${params.id}`)
// }
export const addTeacher = (data) => {
    return http.post('/teacher/', data)
}

export const editTeacher = (data) => {
    return http.put(`/teacher/${data.id}/`, data)
}

export const delTeacher = (data) => {
    return http.delete(`/teacher/${data.id}`, data)
}



export const getTopic = (params) => {
    console.log(params, 'params')
    // 返回用户列表
    return http.get('/topic/', params)
}

export const addTopic = (data) => {
    console.log(data)
    return http.post('/topic/', data)
}

export const editTopic = (data) => {
    return http.put(`/topic/${data.id}/`, data)

}

export const delTopic = (data) => {
    return http.delete(`/topic/${data.id}/`, data)
}

export const getMenu = (data) => {
    // return http.post('/permission/getMenu', data)
    return http.post('/login/', data)
}



export const getTopicList = (params) => {
    console.log(params, 'params')
    // 返回用户列表
    return http.get('/topiclist/', params)
}

export const addTopicList = (data) => {
    console.log(data)
    return http.post('/topiclist/', data)
}

export const editTopicList = (data) => {
    return http.put(`/topiclist/${data.id}/`, data)

}

export const delTopicList = (data) => {
    return http.delete(`/topiclist/${data.id}/`, data)
}
