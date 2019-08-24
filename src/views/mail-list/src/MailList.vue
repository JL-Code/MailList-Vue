<template>
  <div class="mail-list-container">
    <div class="mail-list-aside">
      <div class="mail-list-panel mail-list-panel_full">
        <div class="mail-list-panel-hd" style="padding-bottom:0">
          <el-autocomplete
            class="inline-input"
            v-model="keyword"
            :fetch-suggestions="querySearchAsync"
            :placeholder="placeholder"
            :trigger-on-focus="false"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="user-info">
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
              v-for="(user, index) in checkedUsers"
              :key="index"
              type="info"
              effect="plain"
              closable
              disable-transitions
              @click="handleClose(user.ID)"
              @close="handleClose(user.ID)"
            >{{ user.Name }}</el-tag>
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
          <div class="list-cell" v-for="com in current.Children" :key="com.ID" @click="reload(com)">
            <i class="el-icon-folder list-cell__icon"></i>
            <span>{{ com.Name }} ({{ com.TotalStaff }})</span>
          </div>
          <!-- 用户 -->
          <el-checkbox-group v-model="checkedIds">
            <el-checkbox
              class="list-cell"
              v-for="user in current.Users"
              :key="user.ID"
              :label="user.ID"
            >
              <div class="user-info">
                <el-avatar v-if="user.Avatar" class="list-cell__icon" :src="user.Avatar"></el-avatar>
                <el-avatar v-else class="list-cell__icon">
                  {{
                  user.Name.substr(-3)
                  }}
                </el-avatar>
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
const COMPONENT_VERSION = "0.0.1";
const mixin = {
  data() {
    return {
      // 面包屑堆栈 /** vue.js 对 Set、Map 属性支持不友好 */
      crumbStack: []
    };
  },
  methods: {
    push(crumb = {}) {
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
      results: []
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
          let results = res.data.Result;
          // 调用 callback 返回建议列表的数据
          this.results = results;
          callback(results);
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
    placeholder: {
      type: String,
      default: "请输入内容"
    }
  },
  data() {
    return {
      version: COMPONENT_VERSION,
      loading: false,
      current: {},
      data: [],
      checkedIds: [],
      users: [],
      inputWidth: 0
    };
  },
  watch: {
    crumbStack(val) {
      console.log("crumb stack", val);
    }
  },
  computed: {
    root() {
      return this.data[0];
    },
    crumbs() {
      return this.crumbStack.map(val => {
        return {
          ID: val.ID,
          Name: val.Name
        };
      });
    },
    checkedUsers() {
      return this.checkedIds.map(id => {
        return this.users.find(u => u.ID === id);
      });
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    reload(data) {
      this.push(data);
      this.current = data;
      if (this.current.Users.length == 0) {
        this.fetchUser(this.current.ID);
      }
    },
    fetchData() {
      this.loading = true;
      axios
        .get(
          "/api/v2/organization_tree?userId=51d9cf3b-2312-e611-97bc-fa7d84a2e3a1"
        )
        .then(res => {
          this.loading = false;
          let data = res.data.Result;
          this.data = data;
          this.current = this.data[0];
          this.users.push(...this.current.Users);
          this.crumbStack.push(this.current);
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
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
            this.users.push(...result);
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
      console.log("remove click");
      let index = this.checkedIds.findIndex(cid => cid === id);
      if (index != -1) {
        this.checkedIds.splice(index, 1);
      } else {
        console.warn(`未找到ID${id}的用户`);
      }
    },
    handleCancel() {
      this.$emit("cancel", []);
    },
    handleConfirm() {
      const users = this.checkedUsers.map(u => ({ id: u.ID, name: u.Name }));
      this.$emit("submit", users);
    }
  }
};
</script>

<style lang="less" scoped>
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

.list-cell {
  display: flex;
  align-items: center;
  min-height: 46px;
  padding: 8px 16px;
  &:hover {
    background: #eee;
  }
}

.list-cell.el-checkbox {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.list-cell__icon {
  margin-right: 10px;
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

.name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.inline-input {
  width: 100%;
}
.el-autocomplete-suggestion__list {
  .user-info {
    padding: 10px 0;
  }
}
</style>
