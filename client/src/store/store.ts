import { atom, atomFamily } from 'recoil';

const selectedOptionState = atomFamily({
  key: 'optionState',
  default: (name) => {
    return {
      name: '',
      option: '',
      checked: false,
    };
  },
});

export const LoggedInUser = atom({
  key: 'userNickname',
  default: '',
});

export const authAtom = atom({
  key: 'auth',
  default: false,
});
