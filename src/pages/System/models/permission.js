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
      const response = yield call(queryPermission,payload||{pageIndex:0,pageSize: 10});
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data:{
          list: action.payload.result.data,
          pagination:{
            total: action.payload.result.total,
            pageSize:10,
            current:0
          }
        }
      };
    },
  },
};
