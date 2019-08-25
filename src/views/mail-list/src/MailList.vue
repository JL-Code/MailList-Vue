<template>
  <div class="mail-list-container">
    <div class="mail-list-aside">
      <div class="mail-list-panel mail-list-panel_full">
        <div class="mail-list-panel-hd" style="padding-bottom:0">
          <el-autocomplete
            style="width:100%"
            v-model="keyword"
            :fetch-suggestions="querySearchAsync"
            :placeholder="placeholder"
            :trigger-on-focus="false"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="mail-list-user" v-if="item">
                <el-avatar v-if="item.Avatar" class="list-cell__icon" :src="item.Avatar"></el-avatar>
                <el-avatar v-else class="list-cell__icon">
                  {{
                  item.Name.substr(-3)
                  }}
                </el-avatar>
                <span>{{ item.Name }}</span>
              </div>
            </template>
          </el-autocomplete>
        </div>
        <!-- 已选用户 -->
        <div class="mail-list-panel-bd">
          <div class="selected-user">
            <el-tag
              class="selected-user__item"
              v-for="(item, index) in checkedItems"
              :key="index"
              type="info"
              effect="plain"
              closable
              disable-transitions
              @click="handleClose(item.id||item.ID)"
              @close="handleClose(item.id||item.ID)"
            >{{ item.name||item.Name }}</el-tag>
          </div>
        </div>
        <div class="mail-list-panel-ft" style="text-align:left">
          <el-button type="primary" size="medium" @click="handleConfirm">确定</el-button>
          <el-button size="medium" @click="handleCancel">取&nbsp;消</el-button>
        </div>
      </div>
    </div>
    <div class="mail-list-main">
      <!-- 组织机构列表 -->
      <div class="mail-list-panel">
        <div class="mail-list-panel-hd">
          <!-- 面包屑导航 -->
          <el-breadcrumb separator="/" class="mail-list-crumb">
            <el-breadcrumb-item
              class="mail-list-crumb__item"
              v-for="(crumb, index) in crumbs"
              :key="index"
              @click.native="popStack(crumb)"
            >{{ crumb.Name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="mail-list-panel-bd" v-loading="loading">
          <!-- 公司 -->
          <div
            class="mail-list-cell"
            v-for="com in current.Children"
            :key="com.ID"
            @click="load(com)"
          >
            <img class="list-cell__icon" :src="com.Icon" v-if="com.Icon" />
            <i class="el-icon-folder list-cell__icon" v-else></i>
            <span>{{ com.Name }} ({{ com.TotalStaff }})</span>
          </div>
          <!-- 用户 -->
          <el-checkbox-group v-model="checkedIds">
            <el-checkbox
              class="mail-list-cell"
              v-for="user in current.Users"
              :key="user.ID"
              :label="user.ID"
            >
              <div class="mail-list-user">
                <el-avatar v-if="user.Avatar" class="list-cell__icon" :src="user.Avatar"></el-avatar>
                <el-avatar v-else class="list-cell__icon">{{user.Name.substr(-3)}}</el-avatar>
                <span>{{ user.Name }}</span>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- <div class="mail-list-panel-ft"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { difference, unionWith, cloneDeep } from "lodash";
const COMPONENT_VERSION = "0.0.1";
const mixin = {
  data() {
    return {
      // 面包屑堆栈 /** vue.js 对 Set、Map 属性支持不友好 */
      crumbStack: []
    };
  },
  computed: {
    crumbs() {
      return this.crumbStack.map(val => {
        return {
          ID: val.ID,
          Name: val.Name
        };
      });
    }
  },
  methods: {
    pushStack(crumb = {}) {
      // 入栈
      this.crumbStack.push(crumb);
    },
    popStack(crumb = {}) {
      console.log("pop", crumb);
      // 出栈时 移除 crumb 及上层所有crumb。
      let stack = this.crumbStack;
      let index = stack.findIndex(item => item.ID === crumb.ID);
      let current = stack[index];
      if (index !== stack.length - 1) {
        // 语法 array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
        stack.splice(index + 1);
        this.current = current;
      }
    }
  }
};
const searchMixin = {
  data() {
    return {
      keyword: "",
      inputVisible: false,
      // 搜索结果
      searchResults: []
    };
  },
  watch: {
    keyword(val) {
      // this.querySearchAsync(val);
    }
  },
  methods: {
    querySearchAsync(qs, callback) {
      this.showResult();
      // 远程获取数据
      this.search(this.current.ID, qs)
        .then(res => {
          let searchResults = res.data.Result;
          // 调用 callback 返回建议列表的数据
          this.searchResults = searchResults;
          callback(searchResults);
        })
        .catch(err => {
          // 调用 callback 返回建议列表的数据
          console.log(err);
        });
    },
    showResult() {
      this.inputVisible = true;
    },
    // 处理选择搜索结果
    handleSelect(item) {
      if (this.checkedIds.indexOf(item.ID) > -1) {
        this.$message({
          message: "请不要重复添加",
          type: "warning"
        });
      } else {
        this.users.push(item);
        this.checkedIds.push(item.ID);
      }
    }
  }
};
export default {
  name: "MailList",
  mixins: [mixin, searchMixin],
  props: {
    userId: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: "请输入内容"
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      version: COMPONENT_VERSION,
      loading: false,
      innerValue: cloneDeep(this.value),
      // 数据源
      data: [],
      // 当前选中的组织
      current: {},
      // 当前选中的用户ID
      checkedIds: [],
      // 当前已加载的用户
      loadedUsers: [],
      // 脏数据
      ditry: []
    };
  },
  watch: {
    checkedIds(newVal, oldVal) {
      // 集合差集
      if (newVal.length < oldVal.length) {
        let diff = difference(oldVal, newVal);
        this.remove(diff);
      }
    }
  },
  computed: {
    root() {
      return this.data[0];
    },
    /**
     *
     */
    activeItems() {
      let filters = this.loadedUsers.filter(
        u => this.checkedIds.indexOf(u.ID) > -1
      );
      return filters.map(f => ({ id: f.ID, name: f.Name }));
    },
    /**
     * 选中数据
     */
    checkedItems() {
      // innerValue 、activeItems 并集(连集 union)
      return unionWith(this.activeItems, this.innerValue, function(
        first,
        last
      ) {
        return first.id === last.id;
      });
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    setValues() {
      // 带值重入
      this.checkedIds.push(...this.innerValue.map(v => v.id));
    },
    /**
     * @description 加载指定组织的用户数据
     */
    load(data) {
      // 面包屑导航入栈
      this.pushStack(data);
      this.current = data;
      if (this.current.Users.length == 0) {
        this.fetchUser(this.current.ID);
      }
    },
    /**
     * @description 加载组织架构
     */
    fetchData() {
      this.loading = true;
      axios
        .get("/api/v2/organization_tree?userId=" + this.userId)
        .then(res => {
          this.loading = false;
          let data = res.data.Result;
          this.data = data;
          this.current = this.data[0];
          this.loadedUsers.push(...this.current.Users);
          this.crumbStack.push(this.current);
          //
          this.setValues();
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    /**
     * @description 加载用户数据
     */
    fetchUser(orgId, keyword = "") {
      this.loading = true;
      let params = { orgGUID: orgId };
      if (keyword) params.keyword = keyword;
      axios({
        url: "/api/v2/organization_tree/users_search",
        method: "get",
        params: params
      })
        .then(({ data }) => {
          this.loading = false;
          if (data.ErrCode === 0) {
            let result = data.Result;
            this.current.Users = result;
            this.loadedUsers.push(...result);
          } else {
            this.$message.error(data.ErrMsg || "查询数据失败!");
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    /**
     * 搜索用户
     */
    search(orgId, keyword = "") {
      let params = { orgGUID: orgId };
      if (keyword) params.keyword = keyword;
      return axios({
        url: "/api/v2/organization_tree/users_search",
        method: "get",
        params: params
      });
    },
    /**
     * 移除选中用户
     */
    handleClose(id) {
      let index = this.checkedIds.findIndex(cid => cid === id);
      if (index != -1) {
        this.checkedIds.splice(index, 1);
      }
      this.remove(id);
    },
    handleCancel() {
      this.$emit("cancel", []);
    },
    handleConfirm() {
      // TODO: checkeUsers 改为 innerValue
      const data = cloneDeep(this.checkedItems);
      this.$emit("submit", data);
    },
    remove(data = []) {
      let removed = this.innerValue.filter(v => data.indexOf(v.id) > -1);
      if (removed.length) {
        removed.forEach(r => {
          let index = this.innerValue.findIndex(v => v.id === r.id);
          this.innerValue.splice(index, 1);
        });
        this.ditry.push(...removed);
      }
    }
  }
};
</script>

<style lang="less">
.mail-list-dialog {
  .el-dialog__body {
    padding: 0 20px;
  }
}
.mail-list-container {
  background: #fff;
  height: 600px;
  display: flex;
}

.mail-list-aside {
  flex: 1;
  border-right: 1px solid #eee;
}

.mail-list-main {
  flex: 1;
}

.mail-list-panel {
  display: flex;
  flex-direction: column;
  min-height: 400px;
  max-height: 100%;
  width: 100%;
}

.mail-list-panel_full {
  height: 100%;
}

.mail-list-panel-hd {
  padding: 16px;
}

.mail-list-panel-bd {
  flex: 1;
  overflow: auto;
}

.mail-list-panel-ft {
  padding: 24px 32px;
}

.mail-list-cell {
  display: flex;
  align-items: center;
  min-height: 32px;
  padding: 8px 16px;
  &:hover {
    background: #eee;
  }
}

.mail-list-cell.el-checkbox {
  display: flex;
  align-items: center;
}

.mail-list-user {
  display: flex;
  align-items: center;
}
.list-cell__icon {
  margin-right: 10px;
}
img.list-cell__icon {
  display: block;
  width: 14px;
  height: 14px;
  color: #606266;
}
.mail-list-crumb__item {
  .el-breadcrumb__inner {
    color: #303133;

    &:hover {
      color: #2f9aff;
      cursor: pointer;
    }
  }

  &:last-child {
    .el-breadcrumb__inner {
      font-weight: normal;
      color: #c0c4cc !important;

      &:hover {
        color: inherit;
        cursor: not-allowed !important;
      }
    }
  }
  .el-breadcrumb__separator {
    margin: 0 4px;
  }
}

.selected-user {
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
}

.selected-user__item {
  margin-right: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.el-autocomplete-suggestion__list {
  .mail-list-user {
    padding: 10px 0;
  }
}
</style>
