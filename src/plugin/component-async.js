import Vue from "vue";

// export default function(com, el = "#app") {
export default function(com, cb) {
  return new Promise(resolve => {
    const template = Vue.extend({
      name: "intermediate-component",
      // 中间层
      components: { com },
      methods: {
        close(data) {
          resolve(data);
        }
      },
      render() {
        return <com onClose={this.close} />;
      }
    });
    // 将扩展后的组件挂载到DOM树中
    // const component = new template().$mount();
    // document.querySelector(el).appendChild(component.$el);
    cb && cb(template);
  });
}
