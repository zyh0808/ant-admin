<template>
  <div class="upload-image">
    <!-- :customRequest="uploadImage" -->
    <!-- action="https://www.mocky.io/v2/5cc8019d300000980a055e76" -->
    <!-- @change="handleChange" -->
    <a-upload :customRequest="uploadImage" list-type="picture-card" :file-list="fileList" @preview="handlePreview" name="image" multiple>
      <div v-if="fileList.length < 4">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          上传
        </div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
import request from '@/js/request'
export default {
  data () {
    return {
      upLoading: false,
      previewVisible: false,
      previewImage: '',
      fileList: [],
    }
  },
  methods: {
    uploadImage (file) {
      this.upLoading = true
      const formData = new FormData()
      formData.append('image', file.file)
      request({
        url: `/UpLoadFiles/FileToServers?S=ZSYYT&UID=390&M=KHZL&p=PQLS&t=0.0035206430344270068`,
        method: 'post',
        data: formData
      }).then(res => {
        const image = {
          uid: file.file.uid,
          name: file.file.name,
          status: 'done',
          url: res.ResultDataFull[0].URL
        }
        this.fileList.push(image)
        file.onSuccess()
        this.upLoading = false
      }).catch(err => {
        const errImage = {
          uid: file.file.uid,
          name: file.file.name,
          status: 'error'
        }
        this.fileList.push(errImage)
        file.onError()
        this.upLoading = false
        this.$message.error(err.msg)
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
      this.fileList = fileList
    }
  }
}
</script>

<style>
</style>