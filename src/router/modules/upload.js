import uploadImage from "../../views/upload/uploadImage.vue"
import main from "../../views/main.vue"

const routes = [
  {
    path: "/upload",
    name: "upload",
    component: main,
    children: [
      {
        path: "uploadImage",
        name: "uploadImage",
        component: uploadImage
      }
    ]
  },
]

export default routes
