import { queryPermission } from '@/services/api';

export default {
  namespace: 'permission',

  state: {
    data: {
      list:[],
      pagination:{},
    },
  },

  effects: {
    * fetchList({ payload }, { call, put }) {
      let params = payload||{pageIndex: 0,pageSize:10};
      const response = yield call(queryPermission,params);
      const dataList = {
        list:response.result.data,
        pagination:{
          total:response.result.total,
          pageSize:params.pageSize,
          current: params.pageIndex+1
        }
      };
      yield put({
        type: 'save',
        payload: dataList,
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data:action.payload,
      };
    },
  },
};
