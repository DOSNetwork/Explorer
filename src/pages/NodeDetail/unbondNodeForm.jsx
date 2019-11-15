import React from "react";
import { Modal, Form, Input } from "antd";

const unbondNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, confirmLoading, onCancel, onCreate, form } = this.props;
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
                    required: true,
                    message: "Please input the unbond token amount!"
                  }
                ]
              })(<Input placeholder="50000.0" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);
export default unbondNode;
