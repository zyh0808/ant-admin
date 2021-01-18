module.exports = {
  // presets: [
  //   '@vue/cli-plugin-babel/preset'
  // ],
  // plugins: [
  //   [
  //     "import",
  //     { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
  //   ]
  // ]
  presets: ['@vue/app'],
  plugins: [['import', { libraryName: 'ant-design-vue' }, 'ant-design-vue']]
}
