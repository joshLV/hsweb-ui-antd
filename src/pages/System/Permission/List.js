import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import styles from '../../List/TableList.less';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import StandardTable from '../../../components/StandardTable';
import Save from './Save';


@connect(({ permission, loading }) => ({
  permission,
  loading: loading.models.permission,
}))
@Form.create()
class List extends PureComponent {
  state = {
    selectedRows: [],
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
      render: (text, record) => {
        return 1 === text ? '正常' : '';
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleEditModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'permission/fetchList',
    });
  }

  handleEditModalVisible = (flag, record) => {
    this.setState({
      editModalVisible: !!flag,
      editFormValues: record || {},
    });

  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    console.log(pagination, filtersArg, sorter, '翻页');
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}}`;
    }

    dispatch({
      type: 'permission/fetchList',
      payload: params,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="ID">
              {getFieldDecorator('id')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button icon="search" type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>

            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { selectedRows, editFormValues, editModalVisible } = this.state;
    const {
      permission: { data },
      loading,
    } = this.props;
    const updateMethods = {
      handleEditModalVisible: this.handleEditModalVisible,
    };
    return (
      <PageHeaderWrapper title="权限管理">
        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
        <div className={styles.tableListOperator}>
          <Button type="primary" icon="plus" style={{ marginLeft: 8,marginBottom:10 }} onClick={()=>this.handleEditModalVisible(true, {})}>
            新建权限
          </Button>
        </div>
        <StandardTable
          rowKey={record => record.id}
          selectedRows={selectedRows}
          onSelectRow={this.handleSelectRows}
          data={data}
          loading={loading}
          columns={this.columns}
          onChange={this.handleStandardTableChange}
        />

        {editFormValues ? (
          <Save
            {...updateMethods}
            editModalVisible={editModalVisible}
            values={editFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default List;
