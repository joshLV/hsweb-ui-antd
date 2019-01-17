import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Divider, Form, Table } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';

@connect(({ permission, loading }) => ({
  permission,
  loading: loading.models.permission,
}))
@Form.create()
class Permission extends Component {

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
          <a href="">编辑</a>
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


  render() {

    const {permission: {data},loading} = this.props;

    console.log(data, 'data-props');

    return (
      <PageHeaderWrapper title="权限管理">
        <StandardTable
          selectedRows={[]}
          data={data}
          loading = {loading}
          columns = {this.columns}
        />
      </PageHeaderWrapper>

    );
  }
}

export default Permission;
