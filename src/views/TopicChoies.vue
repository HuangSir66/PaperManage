<template>
  <div class="manage">
    <el-dialog
        title="论文信息"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
      <!-- 用户的表单信息 -->
      <el-form ref="form" :rules="rules" :inline="true" :model="form" label-width="80px">
        <el-form-item label="学生学号" prop="studentId">
          <el-select v-model="form.studentId" placeholder="选择学生学号">
            <el-option v-for="stu in studentData" :key="stu.id" :label="stu.studentId" :value="stu.id"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="学生姓名" prop="studentName">-->
<!--          <el-select v-model="form.studentName" placeholder="选择学生姓名">-->
<!--            <el-option v-for="stu in studentData" :key="stu.id" :label="stu.name" :value="stu.id"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="指导教师" prop="teacherName">-->
<!--          <el-select v-model="form.teacherName" placeholder="选择教师">-->
<!--            <el-option v-for="teacher in teacherData" :key="teacher.id" :label="teacher.name" :value="teacher.id"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="选择论文" prop="topicTitle">
          <el-select v-model="form.topicTitle" placeholder="选择论文">
            <el-option v-for="topic in teachTopic" :key="topic.id" :label="topic.title" :value="topic.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
    <div class="manage-header">
      <el-button @click="handleAdd" type="primary">
        + 新增
      </el-button>
      <!-- form搜索区域 -->
      <el-form :inline="true" :model="userForm" style="position: absolute ;right: 10px;margin-top: 25px ">
        <el-form-item>
          <el-input placeholder="请输入论文名称" v-model="userForm.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-tabel">
      <el-table
          stripe
          height="90%"
          :data="tableData"
          style="width: 100%">
        <el-table-column
            prop="studentId"
            label="学生学号">
          <template slot-scope="scope">
            {{getStudentId(scope.row.studentId)}}
          </template>
        </el-table-column>
        <el-table-column
            prop="studentName"
            label="学生姓名">
          <template slot-scope="scope">
            {{getStudentName(scope.row.studentId)}}
          </template>
        </el-table-column>
        <el-table-column
            prop="topicName"
            label="论文标题">
          <template slot-scope="scope">
            {{getTopicTitle(scope.row.topicTitle)}}
          </template>
        </el-table-column>
        <el-table-column
            prop="teacherName"
            label="指导教师">
          <template slot-scope="scope">
            {{getTopicTeacherName(scope.row.topicTitle)}}
          </template>
        </el-table-column>
        <el-table-column
            prop="addr"
            label="操作">
          <template slot-scope="scope">
            <el-button v-if="shouldShowEditButton(scope.row)" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="shouldShowEditButton(scope.row)||role==='管理员'" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager">
        <el-pagination
            layout="prev, pager, next"
            :total="total"
            @current-change="handlePage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getTopicList, addTopicList, editTopicList, delTopicList,getTeacher,getUser,getTopic } from '@/api'
import Cookie from "js-cookie";

export default {
  data() {
    return {
      value:false,
      dialogVisible: false,
      form: {
        studentId:'',
        // studentName:'',
        // teacherName: '',
        topicTitle: '',
      },
      rules: {
        studentId: [
          { required: true, message: '请选择学生学号' }
        ],
        studentName: [
          { required: true, message: '选择教师姓名' }
        ],
        teacherName: [
          { required: true, message: '请选择学生姓名' }
        ],
        topicName: [
          { required: true, message: '请选择论文' }
        ],

      },
      tableData: [],
      teacherData:[],
      studentData:[],
      topicData:[],
      teachTopic:[],
      modalType: 0, // 0表示新增的弹窗， 1表示编辑
      total: 0, //当前的总条数
      pageData: {
        page: 1,
        limit: 10
      },
      userForm: {
        title: ''
      },
      token:{
        token:Cookie.get('token')
      },
      role:Cookie.get('role')
    }
  },
  methods: {
    // 提交用户表单
    submit() {
      this.$refs.form.validate((valid) => {
        // console.log(valid, 'valid')
        if (valid) {
          // 后续对表单数据的处理
          if (this.modalType === 0) {
            console.log(this.form,'form')
            addTopicList(this.form).then(() => {
              // 重新获取列表的接口
              this.getList()
              // 清空表单的数据
              this.$refs.form.resetFields()
              // 关闭弹窗
              this.dialogVisible = false
            }).catch((error)=>{
              // 判断学号是否存在
              if (error.response && error.response.status === 400 && error.response.data.error === '学生已选题') {
                // 显示学号已存在的错误弹窗
                this.$message.error('学生已选题')
              } else {
                // 显示其他错误信息
                this.$message.error('添加学生失败')
              }
            })
          } else {
            editTopicList(this.form).then(() => {
              // 重新获取列表的接口
              this.getList()
              // 清空表单的数据
              this.$refs.form.resetFields()
              // 关闭弹窗
              this.dialogVisible = false
            })
          }


        }
      })
    },
    // 弹窗关闭的时候
    handleClose() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    cancel() {
      this.handleClose()
    },
    handleEdit(row) {
      // console.log(row,'row')
      this.modalType = 1
      this.dialogVisible = true
      // 注意需要对当前行数据进行深拷贝，否则会出错
      this.form = JSON.parse(JSON.stringify(row))
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTopicList({ id: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 重新获取列表的接口
          //解决删除页面最后一条数据时报404错误，重新调取页码索引
          if (this.tableData.length === 1 && this.pageData.page > 1) {
            this.pageData.page -= 1; // 减少页面索引
          }
          this.getList()
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleAdd() {
      this.modalType = 0
      this.dialogVisible = true
    },
    // 获取列表的数据
    getList() {
      // 获取的列表的数据
      getTopicList({params: {...this.userForm, ...this.pageData}}).then(({ data }) => {
        // console.log(data,'data')
        this.tableData = data.list
        this.total = data.count || 0
      })

      //获取教师信息
      getTeacher().then(({ data }) => {
        // console.log(data,'data')
        this.teacherData = data.alllist
        // console.log(this.teacherData)
      })
      //获取学生信息
      getUser().then(({data}) =>{
        // console.log(data,'userdata')
        this.studentData = data.allStu
      })
      //获取论文信息
      getTopic().then(({data})=>{
        this.topicData = data.allTop
        this.teachTopic = data.teacQueryset
      })
    },
    // 选择页码的回调函数
    handlePage(val) {
      // console.log(val, 'val')
      this.pageData.page = val
      this.getList()
    },
    // 列表的查询
    onSubmit() {
      this.getList()
    },
    //根据主键查找教师姓名
    getTeacherName(scopeRowTeacherId){
      // console.log(scopeRowTeacherId,'id')
      const teacherName = this.teacherData.find(c=>c.id===scopeRowTeacherId)
      return teacherName?teacherName.name:''
    },
    //根据主键查找学生学号
    getStudentId(scopeRowStudentId){
      const studentId = this.studentData.find(c=>c.id=== scopeRowStudentId)
      return studentId?studentId.studentId:''
    },
    //根据主键查找学生信息
    getStudentName(scopeRowStudentId){
      const studentName = this.studentData.find(c=>c.id=== scopeRowStudentId)
      return studentName?studentName.name:''
    },
    //根据主键查找论文信息
    getTopicTitle(scopeRowTopicId){
      const topicName = this.topicData.find(c=>c.id === scopeRowTopicId)
      return topicName?topicName.title:''
    },
    //根据主键通过论文表查找论文信息
    getTopicTeacherName(scopeRowTopicId){
      const topic = this.topicData.find(c=>c.id===scopeRowTopicId)
      //如果未添加if判断条件，则会在挂载前加载teacherName导致报错
      if(topic){
        // console.log(topic.teacherName,'topic.teachername')
        const teacher_name = this.teacherData.find(c=>c.id === topic.teacherName)
        return teacher_name?teacher_name.name:''
      }
    },
    shouldShowEditButton(row){
      // 根据特定条件判断是否显示编辑按钮
      // 这里可以根据需要修改条件判断的逻辑
      // console.log(row.teacherName,'row1')
      // console.log(this.form.teacherName,'row2')
      // console.log(row,'row')
      const topic = this.topicData.find(c=>c.id===row.topicTitle)
      // console.log(topic,'topic')
      if(topic){
        // console.log(topic.teacherName,"teachername")
        return topic.teacherName === parseInt(Cookie.get('id'))
      }
    },
  },
  // computed:{
  //   showEditButton(scope){
  //     console.log(scope.row.teacherName)
  //     return scope.row.teacherName === this.form.teacherName
  //   }
  // },
  mounted () {
    this.getList()
  }
}
</script>
<style lang="less" scoped>
.manage {
  height: 90%;
  .manage-header {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  .common-tabel {
    position: relative;
    height: calc(100% - 62px);
    .pager {
      position: absolute;
      bottom: 0;
      right: 20px;
    }
  }
}
</style>