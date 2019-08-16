import Vue from "vue";

/// 将dialog 封装到 Promise 中
export default function(component, options = {}, cb) {
  return new Promise((resolve, reject) => {
    let defaults = {
      // Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
      appendToBody: false,
      // 关闭时销毁 Dialog 中的元素
      destroyOnClose: false
    };
    defaults = Object.assign({}, defaults, options);
    const template = Vue.extend({
      name: "intermediate-component",
      components: { embedded: component },
      data() {
        return {
          visible: true
        };
      },
      methods: {
        submit(data) {
          this.hide();
          resolve(data);
        },
        cancel(data) {
          this.hide();
          reject(data);
        },
        close(done) {
          done();
          this.cancel("取消");
        },
        hide() {
          this.visible = false;
        }
      },
      render() {
        return (
          <el-dialog
            {...{ attrs: { ...defaults } }}
            visible={this.visible}
            // jsx 的 .sync 语法
            {...{ on: { "update:visible": val => (this.visible = val) } }}
            beforeClose={this.close}
          >
            <embedded onSubmit={this.submit} onCancel={this.cancel} />
          </el-dialog>
        );
      }
    });
    cb && cb(template);
  });
}
