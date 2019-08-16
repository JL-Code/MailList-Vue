<template>
  <div style="background:#f7f7f7;height:100vh;width100vw;padding-top:20px;box-sizing:border-box">
    <div class="mail-list-container">
      <div class="mail-list-aside">
        <div class="mail-list-panel mail-list-panel_full">
          <div class="mail-list-panel-hd">
            <!-- 搜索建议弹框 -->
            <el-popover
              v-model="inputVisible"
              popper-class="search-popover"
              title="联系人"
            >
              <!-- 已选择结果 -->
              <el-checkbox-group
                v-model="checkedSearchUserIds"
                class="search-result"
              >
                <el-checkbox
                  class="list-cell"
                  v-for="user in results"
                  :key="user.ID"
                  :label="user.ID"
                >
                  <div class="user-info">
                    <el-avatar
                      v-if="user.Avatar"
                      class="list-cell__icon"
                      :src="user.Avatar"
                    ></el-avatar>
                    <el-avatar
                      v-else
                      class="list-cell__icon"
                    >
                      {{user.Name.substr(-3)}}
                    </el-avatar>
                    <span>{{user.Name}}</span>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
              <!-- 弹框触发元素 -->
              <el-input
                slot="reference"
                class="inline-input"
                size="medium"
                v-model="keyword"
                placeholder="请输入搜索内容"
              >
              </el-input>
            </el-popover>

          </div>
          <div class="mail-list-panel-bd">
            <div class="selected-user">
              <el-tag
                class="selected-user__item"
                v-for="(user,index) in checkedUsers"
                :key="index"
                type="info"
                effect="plain"
                closable
                disable-transitions
                @click="handleClose(user.ID)"
              >
                {{user.Name}}
              </el-tag>
            </div>
          </div>
          <div
            class="mail-list-panel-ft"
            style="text-align:left"
          >
            <el-button
              type="primary"
              size="medium"
            >确定</el-button>
            <el-button size="medium">取&nbsp;消</el-button>
          </div>
        </div>
      </div>
      <div class="mail-list-main">
        <!-- 组织机构列表 -->
        <div class="mail-list-panel">
          <div class="mail-list-panel-hd">
            <!-- 面包屑导航 -->
            <el-breadcrumb
              separator="/"
              class="mail-list-crumb"
            >
              <el-breadcrumb-item
                class="mail-list-crumb__item"
                v-for="(crumb,index) in crumbs"
                :key="index"
                @click.native="popStack(crumb)"
              >{{crumb.Name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div
            class="mail-list-panel-bd"
            v-loading="loading"
          >
            <!-- 公司 -->
            <div
              class="list-cell"
              v-for="com in current.Children"
              :key="com.ID"
              @click="reload(com)"
            >
              <i class="el-icon-folder list-cell__icon"></i>
              <span>{{com.Name}} ({{com.TotalStaff}})</span>
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
                  <el-avatar
                    v-if="user.Avatar"
                    class="list-cell__icon"
                    :src="user.Avatar"
                  ></el-avatar>
                  <el-avatar
                    v-else
                    class="list-cell__icon"
                  >
                    {{user.Name.substr(-3)}}
                  </el-avatar>
                  <span>{{user.Name}}</span>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <!-- <div class="mail-list-panel-ft"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MailListMock from './MailList.json'
import _ from 'lodash'
import axios from 'axios'

const mixin = {
  data () {
    return {
      // 面包屑堆栈 /** vue.js 对 Set、Map 属性支持不友好 */
      crumbStack: [],
    }
  },
  methods: {
    push (crumb = {}) {
      // 入栈
      this.crumbStack.push(crumb);
    },
    popStack (crumb = {}) {
      console.log('pop', crumb);
      // 出栈时 移除 crumb 及上层所有crumb。
      let stack = this.crumbStack;
      let index = stack.findIndex(item => item.ID === crumb.ID);
      let current = stack[index];
      if (index !== stack.length - 1) {
        // 语法 array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
        stack.splice(index + 1)
        this.current = current
      }
    }
  }
}
const searchMixin = {
  data () {
    return {
      inputVisible: false,
      checkedSearchUserIds: [],
      results: []
    }
  },
  watch: {
    keyword (val) {
      this.querySearchAsync(val);
    }
  },
  methods: {
    querySearchAsync (qs) {
      this.showResult();
      // 远程获取数据
      this.search(this.current.ID, qs).then(res => {
        let results = res.data.Result;
        // 调用 callback 返回建议列表的数据
        console.log("results", results);
        this.results = results;
      }).catch(err => {
        // 调用 callback 返回建议列表的数据
      })

    },
    showResult () {
      this.inputVisible = true;
    },
    // 处理选择搜索结果
    handleSelect (item) {
      console.log(item);
    }
  }
}
export default {
  name: "MailList",
  mixins: [mixin, searchMixin],
  data () {
    return {
      loading: false,
      keyword: '',
      checkedSearchUserIds: [],
      model: [],
      current: {},
      data: [],
      checkedIds: [],
      users: []
    }
  },
  watch: {
    crumbStack (val) {
      console.log("crumb stack", val);
    }
  },
  computed: {
    root () {
      return this.data[0]
    },
    crumbs () {
      return this.crumbStack.map((val) => {
        return {
          ID: val.ID,
          Name: val.Name
        }
      });
    },
    checkedUsers () {
      return this.checkedIds.map(id => {
        return this.users.find(u => u.ID === id);
      });
    }
  },
  mounted () {
    this.fetchData();
  },
  methods: {
    reload (data) {
      this.push(data)
      this.current = data
      if (this.current.Users.length == 0) {
        this.fetchUser(this.current.ID);
      }
    },
    fetchData () {
      this.loading = true;
      axios.get('/api/v2/organization_tree?userId=51d9cf3b-2312-e611-97bc-fa7d84a2e3a1')
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
        })
    },
    fetchUser (orgId, keyword = "") {
      this.loading = true;
      axios.get('/api/v2/organization_tree/users_search?orgGUID=' + orgId + '&keyword=' + keyword)
        .then(res => {
          this.loading = false;
          let data = res.data.Result;
          this.current.Users = data;
          this.users.push(...data);
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        })
    },
    search (orgId, keyword = "") {
      return axios.get('/api/v2/organization_tree/users_search?orgGUID=' + orgId + '&keyword=' + keyword)
    },
    handleClose (id) {
      let index = this.checkedIds.findIndex(cid => cid === id);
      if (index != -1) {
        this.checkedIds.splice(index, 1);
      }
    }
  }
}

</script>

<style lang="less">
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
// .mail-list-crumb {

// }
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
.addr {
  font-size: 12px;
  color: #b4b4b4;
}
.inline-input {
  width: 100%;
}
.search-result {
  height: 500px;
  overflow-y: auto;
}
</style>
