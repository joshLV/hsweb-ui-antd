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
    * fetchList(_, { call, put }) {
      const response = yield call(queryPermission);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, action) {
      console.log(action.payload);
      return {
        ...state,
        data:{
          list: action.payload.result.data,
          pagination:{
            total: action.payload.result.total,
            pageSize:10,
            current:1
          }
        }
      };
    },
  },
};
