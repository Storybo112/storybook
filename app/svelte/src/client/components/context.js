import { getContext, setContext } from 'svelte';

const REGISTER = '__STORYBOOK_register';
const RENDER = '__STORYBOOK_render';

export const setRegister = value => setContext(REGISTER, value);

export const getRegister = () => getContext(REGISTER);

export const setRender = value => setContext(RENDER, value);

export const getRender = () => getContext(RENDER);
