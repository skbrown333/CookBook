import React from 'react';
import { useContext } from 'react';
import { Context } from '../store/Store';
import { updateToasts } from '../store/actions';

export class ToastService {
  state;
  dispatch;

  constructor() {
    [this.state, this.dispatch] = useContext(Context);
  }

  sendToast(args) {
    this.dispatch(updateToasts(this.state.toasts.concat(args)));
  }

  successToast(
    title,
    text = '',
    iconType = 'bell',
    color = 'success',
    toastLifeTimeMs = 5000,
  ): void {
    this.sendToast({
      title,
      color,
      iconType,
      toastLifeTimeMs,
      text: <p>{text}</p>,
    });
  }

  errorToast(
    title,
    text = '',
    iconType = 'alert',
    color = 'danger',
    toastLifeTimeMs = 5000,
  ): void {
    this.sendToast({
      title,
      color,
      iconType,
      toastLifeTimeMs,
      text: <p>{text}</p>,
    });
  }
}
