import React from "react";
import { Modal, Form, Input } from "antd";

const unbondOwnedNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
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
      return (
        <Modal
          visible={visible}
          confirmLoading={confirmLoading}
          title="Unbond"
          okText="Sumbit"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Unbond Amount">
              {getFieldDecorator("tokenAmount", {
                rules: [
                  {
                    required: false,
                    message: "Please input the unbond token amount!"
                  }
                ]
              })(<Input placeholder="50000.0" />)}
            </Form.Item>
            <Form.Item label="Drop Burn Amount">
              {getFieldDecorator("dbAmount", {
                rules: [
                  {
                    required: false,
                    message: "Please input drop burn token amount"
                  }
                ]
              })(<Input placeholder="0.0" />)}
            </Form.Item>
          </Form>
          <p>{modalText}</p>
        </Modal>
      );
    }
  }
);
export default unbondOwnedNode;
