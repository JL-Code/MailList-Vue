import Vue from "vue";
export default function(component, options = {}) {
  return new Promise((resolve, reject) => {
    let defaults = {
      el: undefined,
      // Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
      appendToBody: true,
      // 关闭时销毁 Dialog 中的元素
      destroyOnClose: false,
      top: "5vh",
      width: "50%",
      showClose: true
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
          // 当dialog关闭时从 DOM 中移除
          this.$el.remove();
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
            <embedded
              onSubmit={this.submit}
              {...{ props: { ...defaults } }}
              onCancel={this.cancel}
            />
          </el-dialog>
        );
      }
    });
    // 将扩展后的组件挂载到DOM树中
    const vm = new template().$mount();
    if (defaults.appendToBody) {
      document.querySelector("body").appendChild(vm.$el);
    } else {
      defaults.el.appendChild(vm.$el);
    }
  });
}
