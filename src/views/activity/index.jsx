import React, { Component } from "react";
import {
  Table,
  Tag,
  Form,
  Button,
  Input,
  Collapse,
  Pagination,
  Divider,
  message,
  Select
} from "antd";
import { tableList, deleteItem, editItem } from "@/api/activity";
import EditForm from "./forms/editForm"
const { Column } = Table;
const { Panel } = Collapse;
class ActicityComponent extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    list: [],
    loading: false,
    total: 0,
    listQuery: {
      page: 1,
      limit: 10,
      name: "",
      state:""
    },
    editModalVisible: false,
    editModalLoading: false,
    currentRowData: {
      id: 0,
      name: "",
      code: "",
      days: 0,
      start_date: "",
      end_date: "",
      state: 1
    }
  };
  fetchData = () => {
    this.setState({ loading: true });
    tableList(this.state.listQuery).then((response) => {
      this.setState({ loading: false });
      const list = response.data.data.list;
      const total = response.data.data.total;
      if (this._isMounted) {
        this.setState({ list, total });
      }
    });
  };
  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  filterNameChange = (e) => {
    let value = e.target.value
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        name:value,
      }
    }));
  };
  filterStateChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        state:value,
      }
    }));
  };
  changePage = (page, limit) => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          page,
        },
      }),
      () => {
        this.fetchData();
      }
    );
  };
  changePageSize = (current, limit) => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          page: 1,
          limit,
        },
      }),
      () => {
        this.fetchData();
      }
    );
  };
  handleDelete = (row) => {
    deleteItem({code:row.code}).then(res => {
      message.success("删除成功")
      this.fetchData();
    })
  }
  
  handleEdit = (row) => {
    this.setState({
      currentRowData:Object.assign({}, row),
      editModalVisible: true,
    });
  };
  
  handleAdd = () => {
    console.log('1111');
    this.setState({
      editModalVisible: true,
    });
  };

  handleOk = _ => {
    const { form } = this.formRef.props;
    form.validateFields((err, fieldsValue) => {

      console.log('fieldsValue=>', fieldsValue);

      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        'start_date': fieldsValue['start_date'].format('YYYY-MM-DD'),
        'end_date': fieldsValue['end_date'].format('YYYY-MM-DD'),
      };

      this.setState({ editModalLoading: true, });
      editItem(values).then((response) => {
        form.resetFields();
        this.setState({ editModalVisible: false, editModalLoading: false });
        message.success("编辑成功!")
        this.fetchData()
      }).catch(e => {
        message.success("编辑失败,请重试!")
      })
    });
  };

  handleCancel = _ => {
    this.setState({
      editModalVisible: false,
    });
  };
  
  render() {
    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="筛选" key="1">
            <Form layout="inline">
              <Form.Item label="名称:">
                <Input onChange={this.filterNameChange} />
              </Form.Item>
              <Form.Item label="状态:">
                <Select
                  style={{ width: 120 }}
                  onChange={this.filterStateChange}>
                  <Select.Option value="1">开启</Select.Option>
                  <Select.Option value="2">关闭</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon="search" onClick={this.fetchData}>
                  搜索
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  icon="add"
                  onClick={this.handleAdd}
                >
                  添加活动
                </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
        <br />
        <Table
          bordered
          rowKey={(record) => record.id}
          dataSource={this.state.list}
          loading={this.state.loading}
          pagination={false}
        >
          <Column title="序号" dataIndex="id" key="id" width={100} align="center" sorter={(a, b) => a.id - b.id}/>
          <Column title="名称" dataIndex="name" key="name" width={200} align="center"/>
          <Column title="活动编码" dataIndex="code" key="code" width={200} align="center"/>
          <Column title="持续天数" dataIndex="days" key="days" width={150} align="center"/>
          <Column title="开始时间" dataIndex="start_date" key="start_date" width={195} align="center"/>
          <Column title="结束时间" dataIndex="end_date" key="end_date" width={195} align="center"/>
          <Column title="状态" dataIndex="state" key="state" width={195} align="center" render={(state) => {
            let color =
            state === 1 ? "green" : state === 2 ? "red" : "";
            return (
              <Tag color={color} key={state}>
                {state == 1 ? '开启' : '关闭'}
              </Tag>
            );
          }}/>
          <Column title="创建时间" dataIndex="created_at" key="created_at" width={195} align="center"/>
          <Column title="操作" key="action" width={195} align="center"render={(text, row) => (
            <span>
              <Button type="primary" shape="circle" icon="edit" title="编辑" onClick={this.handleEdit.bind(null,row)}/>
              <Divider type="vertical" />
              <Button type="primary" shape="circle" icon="delete" title="删除" onClick={this.handleDelete.bind(null,row)}/>
            </span>
          )}/>
        </Table>
        <br />
        <Pagination
          total={this.state.total}
          pageSizeOptions={["10", "20", "40"]}
          showTotal={(total) => `共${total}条数据`}
          onChange={this.changePage}
          current={this.state.listQuery.page}
          onShowSizeChange={this.changePageSize}
          showSizeChanger
          showQuickJumper
          hideOnSinglePage={true}
        />
        <EditForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.formRef = formRef}
          visible={this.state.editModalVisible}
          confirmLoading={this.state.editModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        />  
      </div>
    );
  }
}

export default ActicityComponent;
