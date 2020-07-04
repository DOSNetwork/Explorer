import React from "react";
import { injectIntl } from 'react-intl'
import { Form, Input, Button, Tooltip, Icon } from "antd";

const labelWithTooltip = (title, tips) => {
  return (
    <div>
      {title}&nbsp;&nbsp;
      <Tooltip placement="topLeft" title={tips}>
        <Icon type="info-circle" />
      </Tooltip>
    </div>
  );
};

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
          <Form.Item label={labelWithTooltip(
            f({ id: 'Form.Lable.DelegateAmount' }),
            f({ id: 'Form.Lable.Tips' })
          )}>
            {getFieldDecorator("tokenAmount", {
              rules: [
                {
                  required: false,
                  message: f({ id: 'Form.Message.InputDelegateAmount' })
                }
              ]
            })(<Input placeholder="100.0" suffix='DOS' />)}
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
