<template>
  <div class="manage">
    <el-dialog
        title="论文信息"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
      <!-- 用户的表单信息 -->
      <el-form ref="form" :rules="rules" :inline="true" :model="form" label-width="80px">
        <el-form-item label="论文标题" prop="title">
          <el-input placeholder="请输入论文标题" v-model="form.title"></el-input>
        </el-form-item>
<!--        <el-form-item label="指导教师" prop="teacherName">-->
<!--          <el-select v-model="form.teacherName" placeholder="选择教师">-->
<!--            <el-option v-for="teacher in teacherData" :key="teacher.id" :label="teacher.name" :value="teacher.id"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="论文方向" prop="topicDirect">
          <el-input placeholder="请输入论文方向" v-model="form.topicDirect"></el-input>
        </el-form-item>
        <el-form-item label="限定人数" prop="maxNum">
          <el-input placeholder="请输入最大人数" v-model="form.maxNum"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
    <div class="manage-header">
      <el-button v-if="role === '教师'" @click="handleAdd" type="primary">
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
            prop="title"
            label="论文标题">
        </el-table-column>
        <el-table-column
            prop="teacherName"
            label="指导教师">
          <template slot-scope="scope">
            {{getTeacherName(scope.row.teacherName)}}
          </template>
        </el-table-column>
        <el-table-column
            prop="topicDirect"
            label="论文方向">
        </el-table-column>
        <el-table-column
            prop="maxNum"
            label="限定人数">
        </el-table-column>
<!--        <el-table-column-->
<!--            prop="num"-->
<!--            label="已选人数">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--            prop="publish"-->
<!--            label="是否发布">-->
<!--          <template>-->
<!--            <el-switch-->
<!--                v-model="value"-->
<!--                active-color="#13ce66"-->
<!--                inactive-color="#ff4949">-->
<!--            </el-switch>-->
<!--          </template>-->
<!--        </el-table-column>-->


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
import { getTopic, addTopic, editTopic, delTopic,getTeacher } from '@/api'
import Cookie from "js-cookie";

export default {
  data() {
    return {
      value:false,
      dialogVisible: false,
      form: {
        title:'',
        teacherName: parseInt(Cookie.get('id')),
        maxNum: '',
        topicDirect: '',
      },
      rules: {
        title: [
          { required: true, message: '请输入论文标题' }
        ],
        // teacherName: [
        //   { required: true, message: '请输入姓名' }
        // ],
        maxNum: [
          { required: true, message: '请输入年龄' }
        ],
        topicDirect: [
          { required: true, message: '请选择学院' }
        ],

      },
      tableData: [],
      teacherData:[],
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
            // console.log(this.form,'form')
            addTopic(this.form).then(() => {
              // 重新获取列表的接口
              this.getList()
            })
          } else {
            editTopic(this.form).then(() => {
              // 重新获取列表的接口
              this.getList()
            })
          }

          // 清空表单的数据
          this.$refs.form.resetFields()
          // 关闭弹窗
          this.dialogVisible = false
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
        delTopic({ id: row.id }).then(() => {
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
      getTopic({params: {...this.userForm, ...this.pageData}}).then(({ data }) => {
        // console.log(data,'data')
        this.tableData = data.list

        this.total = data.count || 0
      })
      // while (currentPage <= totalPages) {
      //   const response = await getTeacher({ page: currentPage });
      //
      //   const { list, pagination } = response.data;
      //   allTeacherData = allTeacherData.concat(list); // 将当前页面的数据合并到 allTeacherData 数组中
      //
      //   currentPage += 1;
      //   totalPages = pagination.total_pages;
      // }
      getTeacher().then(({ data }) => {
        console.log(data,'data')
        this.teacherData = data.alllist
        // console.log(this.teacherData)
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
    shouldShowEditButton(row){
      // 根据特定条件判断是否显示编辑按钮
      // 这里可以根据需要修改条件判断的逻辑
      console.log(row.teacherName,'row1')
      console.log(this.form.teacherName,'row2')
      return row.teacherName === this.form.teacherName ;
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