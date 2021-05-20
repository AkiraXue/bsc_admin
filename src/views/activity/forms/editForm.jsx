import React, { Component } from "react";
import { Form, Input, DatePicker, Select, Rate, Modal } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
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
    const { id, name, code, days, start_date, end_date, state} = currentRowData;
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
          <Form.Item label="序号:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="标题:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入标题!" }],
              initialValue: name,
            })(<Input placeholder="标题" />)}
          </Form.Item>
          <Form.Item label="活动编号:">
            {getFieldDecorator("code", {
              initialValue: code,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="活动天数:">
            {getFieldDecorator("days", {
              initialValue: days,
            })(<Input placeholder="活动天数" />)}
          </Form.Item>
          <Form.Item label="起始时间:">
            {getFieldDecorator("start_date", {
              rules: [{ type: 'object', required: true, message: '请选择时间!' }],
              initialValue: moment(start_date || "YYYY-MM-DD"),
            })(<DatePicker showTime format="YYYY-MM-DD" />)}
          </Form.Item>
          <Form.Item label="截止时间:">
            {getFieldDecorator("end_date", {
              rules: [{ type: 'object', required: true, message: '请选择时间!' }],
              initialValue: moment(end_date || "YYYY-MM-DD"),
            })(<DatePicker showTime format="YYYY-MM-DD" />)}
          </Form.Item>
          <Form.Item label="状态:">
            {getFieldDecorator("state", {
              initialValue: state,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="1">开启</Select.Option>
                <Select.Option value="2">关闭</Select.Option>
              </Select>
            )}
          </Form.Item>

          {
            /* 
            <Form.Item label="推荐指数:">
              {getFieldDecorator("star", {
                initialValue: star.length,
              })(<Rate count={3} />)}
            </Form.Item> 
            */
          }
        </Form>
      </Modal>
    );
  }
}

// YYYY-MM-DD HH:mm:ss

export default Form.create({ name: "EditForm" })(EditForm);
