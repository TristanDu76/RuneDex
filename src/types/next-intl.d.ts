import en from '../lib/translations/en.json';

type Messages = typeof en;

declare global {
    type IntlMessages = Messages;
}

export {};
