import React, { Component, Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Divider, Form, Modal, Steps, Table } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
const { Step } = Steps
@connect(({ permission, loading }) => ({
  permission,
  loading: loading.models.permission,
}))
@Form.create()
class Permission extends PureComponent {

  state={
    selectedRows:[],
    editModalVisible: false,
    editFormValues: {},
  };

  columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={()=> this.handleEditModalVisible(true,record)}>编辑</a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </Fragment>
        )
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'permission/fetchList',
    });
  }

  handleEditModalVisible = (flag,record)=>{
    this.setState({
      editModalVisible: !!flag,
      editFormValues: record
    })
  };
  handleSelectRows = rows =>{
    this.setState({
      selectedRows: rows,
    });
  };

  render() {

    const { selectedRows,editFormValues } = this.state;

    const {permission: {data},loading} = this.props;
    return (
      <PageHeaderWrapper title="权限管理">
        <StandardTable
          rowKey={record=>record.id}
          selectedRows={ selectedRows }
          onSelectRow = {this.handleSelectRows}
          data={data}
          loading = {loading}
          columns = {this.columns}
        />
      </PageHeaderWrapper>

    );
  }
}

export default Permission;


class UpdateForm extends PureComponent {

  static defaultProps = {
    hanldeUpdate: () => {},
    handleUpdateModalVisible:()=>{},
    values: {},
  }

  render() {
    return (
      <Modal
        width={640}
        bodyStyle={{padding:'32px 40px 48px'}}
        destroyOnClose
        title="编辑权限"
        visible="true"
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="配置规则属性" />
          <Step title="设定调度周期" />
        </Steps>
      </Modal>
    );
  }
}
