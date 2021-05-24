import React, { Component } from "react";
import { Form, Input, DatePicker, Select, Rate, Modal } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
const currentDate = moment().format('YYYY-MM-DD');
class EditForm extends Component {
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      currentRowData,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      id, name, nickname, account_id, openid, birthday, phone, mobile, state
    } = currentRowData;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title="编辑"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          {
            id ?
            <Form.Item label="序号:">
              {getFieldDecorator("id", {
                initialValue: id?id:'',
              })(<Input disabled />)}
            </Form.Item>
            : ''
          }
          <Form.Item label="昵称:">
            {getFieldDecorator("nickname", {
              rules: [{ required: true, message: "请输入昵称!" }],
              initialValue: nickname?nickname:'',
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="名称:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入名称!" }],
              initialValue: name?name:'',
            })(<Input placeholder="名称" />)}
          </Form.Item>
          {
            account_id ?
            <Form.Item label="用户唯一id:">
              {getFieldDecorator("account_id", {
                initialValue: account_id ? account_id:'',
              })(<Input disabled />)}
            </Form.Item>
            : ''
          }
          {
            openid ?
            <Form.Item label="用户微信唯一id:">
              {getFieldDecorator("openid", {
                initialValue: openid ? openid:'',
              })(<Input disabled />)}
            </Form.Item>
            : ''
          }
        
          <Form.Item label="手机:">
            {getFieldDecorator("mobile", {
              rules: [{ required: true, message: "请输入手机!" }],
              initialValue: mobile?mobile:'',
            })(<Input placeholder="手机" />)}
          </Form.Item>

          <Form.Item label="座机:">
            {getFieldDecorator("phone", {
              rules: [{ required: true, message: "请输入座机!" }],
              initialValue: phone?phone:'',
            })(<Input placeholder="座机" />)}
          </Form.Item>

          <Form.Item label="生日:">
            {getFieldDecorator("birthday", {
              rules: [{ type: 'object', required: true, message: '请选择时间!' }],
              initialValue: moment(birthday ? birthday : currentDate|| "YYYY-MM-DD"),
            })(<DatePicker showTime format="YYYY-MM-DD" />)}
          </Form.Item>

          <Form.Item label="状态:">
            {getFieldDecorator("state", {
              initialValue: state ? state : "开启",
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="1">开启</Select.Option>
                <Select.Option value="2">关闭</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

// YYYY-MM-DD HH:mm:ss

export default Form.create({ name: "EditForm" })(EditForm);
