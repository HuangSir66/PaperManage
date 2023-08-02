<template>
  <div class="manage">
    <el-dialog
        title="教师信息"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
      <!-- 用户的表单信息 -->
      <el-form ref="form" :rules="rules" :inline="true" :model="form" label-width="80px">
        <el-form-item label="教职id" prop="teacherId">
          <el-input placeholder="请输入教职id" v-model="form.teacherId"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-input placeholder="请输入学院" v-model="form.college"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="itro">
          <el-input placeholder="" v-model="form.itro"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input placeholder="请输入电话" v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="form.password"></el-input>
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
      <div style="position: absolute; left: 82px">
        <el-button @click="exportToExcel" type="success">导出Excel</el-button>
        <input ref="fileInput" type="file" accept=".xlsx" @change="handleExcelUpload " style="display: none">
        <el-button @click="$refs.fileInput.click()" type="success">导入Excel</el-button>
        <input ref="fileInput" type="file" accept=".xlsx" @change="handleExcelUpload" style="display: none">
        <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
      </div>
      <!-- form搜索区域 -->
      <el-form :inline="true" :model="userForm" style="margin-top: 25px">
        <el-form-item>
          <el-input placeholder="请输入名称" v-model="userForm.name"></el-input>
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
          @selection-change="handleSelectionChange"
          style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
            prop="teacherId"
            label="教职Id">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名">
        </el-table-column>
        <el-table-column
            prop="sex"
            label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.sex == 1 ? '男' : '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="college"
            label="学院">
        </el-table-column>
        <el-table-column
            prop="itro"
            label="介绍">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="电话">
        </el-table-column>
        <el-table-column
            prop="addr"
            label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
import {getTeacher, addTeacher, editTeacher, delTeacher} from '../api'
import Cookie from "js-cookie";
import { saveAs } from 'file-saver';
import * as XLSX from "xlsx";
import axios from "axios";
// import {time} from "mockjs/src/mock/random/date";

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        teacherId:'',
        name: '',
        sex: '',
        college: '',
        itro: '',
        phone:'',
        password:'',
      },
      rules: {
        teacherId: [
          { required: true, message: '请输入教师id' }
        ],
        name: [
          { required: true, message: '请输入姓名' }
        ],
        sex: [
          { required: true, message: '请输入年龄' }
        ],
        college: [
          { required: true, message: '请选择学院' }
        ],
        phone: [
          { required: true, message: '请输入电话' }
        ],
        password: [
          {required:true,message:'请输入密码'}
        ]
      },
      tableData: [],
      modalType: 0, // 0表示新增的弹窗， 1表示编辑
      total: 0, //当前的总条数
      pageData: {
        page: 1,
        limit: 10
      },
      userForm: {
        name: ''
      },
      token:{
        token:Cookie.get('token')
      },
      excelData:[],
      selectedRows: [],
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
            addTeacher(this.form).then(() => {
              // 重新获取列表的接口
              this.getList()
              // 清空表单的数据
              this.$refs.form.resetFields()
              // 关闭弹窗
              this.dialogVisible = false
            })
            .catch((error) => {
              // 判断学号是否存在
              if (error.response && error.response.status === 400 && error.response.data.error === '教职号已存在') {
                // 显示学号已存在的错误弹窗
                this.$message.error('教职id已存在')
              } else {
                // 显示其他错误信息
                this.$message.error('添加用户失败')
              }
            })
          } else {
            editTeacher(this.form).then(() => {
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
        delTeacher({ id: row.id }).then(() => {
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
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    // 获取列表的数据
    getList() {
      // 获取的列表的数据
      getTeacher({params: {...this.userForm, ...this.pageData}}).then(({ data }) => {
        // console.log(data,'data_teh')
        this.tableData = data.list
        console.log(this.tableData,'table_tea')
        this.total = data.count || 0
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
    // 处理Excel文件上传的函数
    handleExcelUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        // 从jsonData数组中提取相关数据，并将其存储在excelData中
        this.excelData = jsonData.map((row) => ({
          teacherId: row[0],
          name: row[1],
          sex: row[2] === '男' ? '1' :'0',
          college: row[3],
          itro: row[4],
          phone: row[5],
          password: row[6],
        }));
        this.$nextTick(()=>{
          // 执行批量添加学生操作
          this.batchAddTeachers();
        })
      };
      reader.readAsArrayBuffer(file);

    },

    // 导出数据到Excel文件的函数
    exportToExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.tableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelData = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'teachers.xlsx');
    },

    // 执行批量添加教师操作的函数
    batchAddTeachers() {
      console.log(this.excelData,'excelData')
      Promise.all(
          this.excelData.map((teacher) => addTeacher(teacher))
          // this.excelData.map((teacher) => {
          //   // 在添加教师之前检查是否已存在相同教师信息
          //   console.log(this.checkIfTeacherExists(teacher))
          //   if (this.checkIfTeacherExists(teacher)) {
          //     return addTeacher(teacher);
          //   }
          //   return Promise.resolve(); // 返回一个已解决的Promise，跳过添加步骤
          // })
      )
          .then(() => {
            // 所有教师成功添加
            this.getList();
            this.excelData = []; // 清空excelData数组
            // 可选择显示成功消息
            this.$message.success('批量添加教师成功');
          })
          .catch((error) => {
            // 处理错误
            this.excelData = []; // 清空excelData数组
            console.error('批量添加失败', error);
            this.getList()
            // 可选择显示错误消息
            this.$message.error('部分教师信息存在，已跳过该信息');
          });
    },
    checkIfTeacherExists(teacher) {
        const name = teacher.name;
        const teacherId = teacher.teacherId;
        // 构造请求URL
        const url = `/api/check-teacher/?name=${name}&teacher_id=${teacherId}`;
        // 发送GET请求
        return axios.get(url)
            .then(response => {
              // 处理后端返回的数据
              const data = response.data;
              return data.exists;  // 返回是否存在的结果
            })
            .catch(error => {
              console.error('请求出错:', error);
              throw error;
            });
      },
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的教师信息')
        return
      }

      this.$confirm('确定要删除选中的教师信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除接口，传入选中的教师信息的ID等参数
        const deletePromises = this.selectedRows.map(row => delTeacher({ id: row.id }))
        Promise.all(deletePromises)
            .then(() => {
              this.$message.success('批量删除成功')
              this.selectedRows = [] // 清空选中的教师信息
              this.getList() // 刷新列表
            })
            .catch(() => {
              this.$message.error('批量删除失败')
            })
      }).catch(() => {
        // 用户取消删除操作
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang="less" scoped>
.manage {
  height: 90%;
  .manage-header {
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