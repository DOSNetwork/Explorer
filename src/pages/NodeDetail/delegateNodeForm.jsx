import React from "react";
import { injectIntl } from 'react-intl'
import { Form, Input, Button } from "antd";

const delegateNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        onSubmit,
        form,
      } = this.props;
      let { formatMessage: f } = this.props.intl;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={onSubmit} layout="vertical">
          <Form.Item label={f({ id: 'Form.Lable.DelegateAmount' })}>
            {getFieldDecorator("tokenAmount", {
              rules: [
                {
                  required: true,
                  message: f({ id: 'Form.Message.InputDelegateAmount' })
                }
              ]
            })(<Input placeholder="50000.0" suffix='DOS' />)}
          </Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            {f({ id: 'Form.Button.Submit' })}
          </Button>
        </Form>
      );
    }
  }
);
export default injectIntl(delegateNode);
