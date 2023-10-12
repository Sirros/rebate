import { useState } from "react";
import { Alert, Button, Form, Input, message, Spin } from "antd";
import request from "../../request/index.js";
import { submitButtonWrapperStyle, submitButtonStyle } from "../Admin/style.js";
import "./home.scss";

const Home = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [money, setMoney] = useState("");
  const [loading, setLoading] = useState(false);

  // 登录
  const handleLogin = (values) => {
    const { username, password } = values;
    request("post", "/api/login", { Username: username, Password: password })
      .then((res) => {
        if (res.status === 200) {
          message.success("登录成功");
          window.localStorage.setItem("token", res.token);
          getShowMoney();
          setIsLogin(true);
          setLoading(true);
        } else {
          message.info(res.message);
        }
      })
      .catch((err) => {
        message.error("网络异常，请重试");
      });
  };

  // 近期日充值总额
  const getShowMoney = () => {
    request("get", "/api/paymentAmount", {
      token: window.localStorage.getItem("token"),
    })
      .then((res) => {
        if (res.status === 200) {
          setMoney(res.data.total_money);
        } else {
          message.info(res.message);
        }
      })
      .catch((err) => {
        message.error("网络异常，请重试");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 申请返利
  const handleApplyGetMoney = () => {
    request("get", "/api/sendMail", {
      token: window.localStorage.getItem("token"),
    })
      .then((res) => {
        if (res.status === 200) {
          message.info("申请成功");
        } else {
          message.info(res.message);
        }
      })
      .catch((err) => {
        message.error("网络异常，请重试");
      });
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

  return (
    <div className="wrapper">
      <div className="head">自动计算，推广码BZR，注册请联系BZR</div>
      <div className="tips mt20">
        <Alert
          className="mt20"
          message="每次提现间隔时间1小时， 申请提现成功后需要VSN饰品以及有其他问题请联系BZR。"
          type="warning"
          showIcon
        />
      </div>
      <div className="login mt20 mb40">
        <Form
          {...formItemLayout}
          name="basic"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[
              {
                required: true,
                message: "请输入账号",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 24,
            }}
            {...buttonItemLayout}
            style={submitButtonWrapperStyle}
          >
            <Button style={submitButtonStyle} type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="total mt20">
        {isLogin && loading && (
          <h2>
            七日内充值总金额： <Spin />
          </h2>
        )}
        {isLogin && !loading && <h2>七日内充值总金额：${money}</h2>}
      </div>
      <div className="apply">
        {isLogin && (
          <Button type="primary" size="large" onClick={handleApplyGetMoney}>
            申请返利
          </Button>
        )}
      </div>
    </div>
  );
};

export default Home;
