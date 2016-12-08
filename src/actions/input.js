/**
 * 在球场
 * zaiqiuchang.com
 */

import logger from '../logger';
import * as utils from '../utils';
import * as apis from '../apis';
import * as actions from './';

export const RESET_INPUT = 'reset_input';
export const INPUT = 'input';

export function resetInput(screenId) {
  return {
    type: RESET_INPUT,
    screenId,
  };
}

export function saveInput(screenId, input) {
  return dispatch => {
    dispatch({
      type: INPUT,
      screenId,
      input,
    });
    dispatch(validateInput(screenId, input));
  };
}

export function validateInput(screenId, input, cbOk) {
  return (dispatch, getState) => {
    let error = {};
    Object.entries(input).forEach(([k, v]) => {
      if (constraints[screenId] && constraints[screenId][k]) {
        error[k] = utils.validateSingle(v, constraints[screenId][k]);
      } else {
        error[k] = [];
      }
    });

    dispatch(actions.errorInput(screenId, error));

    if (cbOk && Object.values(error).every(v => v.length == 0)) {
      cbOk();
    }
  };
}

let accountConstraints = {
  presence: {
    message: '请输入帐号。',
  },
};

let mobileConstraints = {
  presence: {
    message: '请输入手机号。',
  },
  format: {
    pattern: /^\d{11}$/,
    message: '手机号须为11位数字。'
  },
};

let passwordConstraints = {
  presence: {
    message: '请输入密码。',
  },
  length: {
    minimum: 6,
    maximum: 20,
    message: '密码长度须在6到20之间。'
  },
};

let verifyCodeConstraints = {
  presence: {
    message: '请输入验证码。',
  },
  format: {
    pattern: /^\d{4}$/,
    message: '验证码为4位数字。'
  },
};

let constraints = {
  Login: {
    account: accountConstraints,
    password: passwordConstraints,
  },

  RegisterMobile: {
    mobile: mobileConstraints,
    password: passwordConstraints,
  },
  RegisterVerify: {
    code: verifyCodeConstraints,
  },

  EditProfileNickname: {
    nickname: {
      presence: {
        message: '请输入昵称。',
      },
      length: {
        minimum: 3,
        maximum: 20,
        message: '昵称长度须在3到20之间。'
      },
    },
  },
};
