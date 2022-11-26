import { useState } from "react";
import { Button, Form, Input, Radio, message } from "antd";
import request from "../../request/index.js";
import {
  submitButtonWrapperStyle,
  submitButtonStyle,
  textAreaStyle,
} from "./style.js";
import "./admin.scss";

const { TextArea } = Input;

const Admin = () => {
  const [opType, setOpType] = useState("operate-signUp");
  const [form] = Form.useForm();

  const onFormLayoutChange = (form) => {
    if (form.hasOwnProperty("opType")) {
      setOpType(form.opType);
    }
  };

  // 提交
  const handleSubmit = (values) => {
    const { opType, adminPassword, username, password, cookieInfo, mail } =
      values;

    const params = { adminPassword };
    let url = "";

    switch (opType) {
      case "operate-signUp":
        url = "/account/v1/sign-up";
        params.username = username;
        params.password = password;
        doRequest("post", url, params);
        break;
      case "operate-cookie":
        url = "/config/v1/cookie/update";
        params.cookieInfo = cookieInfo;
        doRequest("post", url, params);
        break;
      default:
        url = "/config/v1/mail/update";
        params.mail = mail;
        doRequest("post", url, params);
        break;
    }
  };

  // 请求
  const doRequest = (type = "post", url = "", params = {}) => {
    request(type, url, params)
      .then((res) => {
        if (res.code === 200) {
          message.success("操作成功");
          resetFormHelper();
        } else {
          message.info(res.message);
        }
      })
      .catch((err) => {
        message.error("网络异常，请重试");
      });
  };

  const resetFormHelper = () => {
    switch (opType) {
      case "operate-signUp":
        form.setFieldsValue({ username: "", password: "" });
        break;
      case "operate-cookie":
        form.setFieldsValue({ cookieInfo: "" });
        break;
      default:
        form.setFieldsValue({ mail: "" });
        break;
    }
  };

  //   表单布局
  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 14,
    },
  };
  const buttonItemLayout = {
    wrapperCol: {
      span: 24,
    },
  };

  // 表单校验
  const validateMessages = {
    required: "请填写${label}",
    types: {
      email: "请输入有效的邮箱地址",
    },
  };

  return (
    <div className="admin-wrapper">
      <Form
        {...formItemLayout}
        form={form}
        initialValues={{
          opType: "operate-signUp",
        }}
        onFinish={handleSubmit}
        validateMessages={validateMessages}
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item label="操作类型" name="opType">
          <Radio.Group value={opType}>
            <Radio.Button value="operate-signUp">注册新用户</Radio.Button>
            <Radio.Button value="operate-cookie">更新cookie</Radio.Button>
            <Radio.Button value="operate-emial">修改邮件发送地址</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="管理员密码"
          name={["adminPassword"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="请输入管理员密码" />
        </Form.Item>

        {/* 注册新账号 */}
        {opType === "operate-signUp" && (
          <Form.Item
            label="账号"
            name={["username"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="请输入账号" />
          </Form.Item>
        )}
        {opType === "operate-signUp" && (
          <Form.Item
            label="密码"
            name={["password"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="请输入密码" />
          </Form.Item>
        )}

        {/* 更新cookie */}
        {opType === "operate-cookie" && (
          <Form.Item
            label="新cookie"
            name={["cookieInfo"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <TextArea style={textAreaStyle} rows={4} />
          </Form.Item>
        )}

        {/* 更新邮件地址 */}
        {opType === "operate-emial" && (
          <Form.Item
            label="邮箱"
            name={["mail"]}
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
        )}

        <Form.Item style={submitButtonWrapperStyle} {...buttonItemLayout}>
          <Button style={submitButtonStyle} type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Admin;
