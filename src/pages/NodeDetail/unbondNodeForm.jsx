import React from "react";
import { Form, Input, Button } from "antd";
import { injectIntl } from 'react-intl'
const { Search } = Input
const unbondNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    validateTokenAmount = (rule, value, callback) => {
      let { formatMessage } = this.props.intl;
      if (value) {
        let result = Number(value)
        if (Number.isNaN(result)) {
          callback(formatMessage({ id: 'Form.Error.tokenAmount' }))
        }
      }
      callback()
    };
    setMaxBalance = () => {
      let { maxBalance } = this.props
      console.log(maxBalance)
      setTimeout(() => {
        this.props.form.setFieldsValue({
          tokenAmount: maxBalance
        });
      }, 0)

    }
    render() {
      const {
        form,
        onSubmit
      } = this.props;
      let { formatMessage: f } = this.props.intl;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={onSubmit} layout="vertical">
          <Form.Item label={f({ id: 'Form.Lable.UnbondAmount' })}>
            {getFieldDecorator("tokenAmount", {
              rules: [
                {
                  required: true,
                  message: f({ id: 'Form.Message.InputUnbondAmount' })
                },
                {
                  validator: this.validateTokenAmount,
                }
              ]
            })(<Search placeholder="100.0" suffix='DOS' enterButton='MAX' onSearch={this.setMaxBalance} />)}
          </Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            {f({ id: 'Form.Button.Submit' })}
          </Button>
        </Form>
      );
    }
  }
);
export default injectIntl(unbondNode);
