import React from "react";
import { injectIntl } from 'react-intl'
import { Modal, Form, Input } from "antd";
const ETHAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/
const newNode = Form.create({
  name: "form_in_modal"
})(
  // eslint-disable-next-line
  class extends React.Component {
    validateAddress = (rule, value, callback) => {
      if (value) {
        if (!ETHAddressRegex.test(value)) {
          callback(this.props.intl.formatMessage({ id: 'Form.Error.address' }))
        }
      }
      callback();
    };
    validateTokenAmount = (rule, value, callback) => {
      if (value) {
        let result = Number(value)
        if (Number.isNaN(result)) {
          callback(this.props.intl.formatMessage({ id: 'Form.Error.tokenAmount' }))
        }
        else if (result < 100000) {
          callback(this.props.intl.formatMessage({ id: 'Form.Error.tokenAmount2' }))
        }
      }
      callback()
    };
    validatCutRate = (rule, value, callback) => {
      if (value) {
        let result = Number(value)
        if (Number.isNaN(result)) {
          callback(this.props.intl.formatMessage({ id: 'Form.Error.cutRate' }))
        }
        else if (result > 100 || result < 0) {
          callback(this.props.intl.formatMessage({ id: 'Form.Error.cutRate2' }))
        }
      }
      callback()
    };
    render() {
      const {
        visible,
        confirmLoading,
        onCancel,
        onCreate,
        form,
        modalText
      } = this.props;
      const { getFieldDecorator } = form;
      let { formatMessage: f } = this.props.intl;
      return (
        <Modal
          visible={visible}
          confirmLoading={confirmLoading}
          title={f({ id: 'Form.Title.CreateNode' })}
          okText={f({ id: 'Form.Ok.Create' })}
          cancelText={f({ id: 'Form.Cancel.Create' })}
          onOk={onCreate}
          onCancel={onCancel}
        >
          <Form layout="vertical">
            <Form.Item label={f({ id: 'Form.Lable.Name' })}>
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: f({ id: 'Form.Message.InputName' })
                  }
                ]
              })(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label={f({ id: 'Form.Lable.Node' })}>
              {getFieldDecorator("nodeAddr", {
                rules: [
                  {
                    required: true,
                    message: f({ id: 'Form.Message.InputNodeAddress' })
                  },
                  {
                    validator: this.validateAddress,
                  }
                ]
              })(<Input placeholder="0x" />)}
            </Form.Item>
            <Form.Item label={f({ id: 'Form.Lable.StakingAmount' })}>
              {getFieldDecorator("tokenAmount", {
                rules: [
                  {
                    required: true,
                    message: f({ id: 'Form.Message.InputStakeingAmount' })
                  },
                  {
                    validator: this.validateTokenAmount,
                  }
                ]
              })(<Input placeholder={f({ id: 'Form.Placeholder.InputStakeingAmount' })} suffix='DOS' />)}
            </Form.Item>
            <Form.Item label={f({ id: 'Form.Lable.dbAmount' })}>
              {getFieldDecorator("dbAmount", {
                rules: [
                  {
                    required: false,
                    message: f({ id: 'Form.Message.InputdbAmount' })
                  }
                ]
              })(<Input placeholder="0" suffix='DropBurn' />)}
            </Form.Item>
            <Form.Item label={f({ id: 'Form.Lable.cutRate' })}>
              {getFieldDecorator("cutRate", {
                rules: [
                  {
                    required: true,
                    message: f({ id: 'Form.Message.InputcutRate' })
                  }, {
                    validator: this.validatCutRate
                  }
                ]
              })(<Input placeholder="10" suffix='%' />)}
            </Form.Item>
          </Form>
          <p>{modalText}</p>
        </Modal>
      );
    }
  }
);
export default injectIntl(newNode);
