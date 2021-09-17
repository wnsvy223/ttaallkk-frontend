import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@material-ui/core/styles';
import { useSwitch } from '@material-ui/core';

const SwitchRoot = styled('span')(`
   display: inline-block;
   position: relative;
   width: 62px;
   height: 34px;
   padding: 7px;
`);

const SwitchInput = styled('input')(`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 1;
    margin: 0;
    cursor: pointer;
`);

const SwitchThumb = styled('span')(
  ({ checked }) => `
    position: absolute;
    display: block;
    background-color: ${checked ? '#ff0000' : '#37b328'};
    width: 32px;
    height: 32px;
    border-radius: 16px;
    top: 1px;
    left: 7px;
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);

    &:before {
        display: block;
        content: "";
        width: 100%;
        height: 100%;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="20" height="20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="transform: rotate(360deg);"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M20.52 15.21l-1.8-1.81V8.94a6.86 6.86 0 0 0-5.82-6.88a6.74 6.74 0 0 0-7.62 6.67v4.67l-1.8 1.81A1.64 1.64 0 0 0 4.64 18H8v.34A3.84 3.84 0 0 0 12 22a3.84 3.84 0 0 0 4-3.66V18h3.36a1.64 1.64 0 0 0 1.16-2.79zM14 18.34A1.88 1.88 0 0 1 12 20a1.88 1.88 0 0 1-2-1.66V18h4z"></path></svg>') center center no-repeat;
    }

    &.focusVisible {
        background-color: #79B;
    }

    &.checked {
        transform: translateX(16px);
        &:before {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="20" height="20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="transform: rotate(360deg);"><path d="M15.88 18.71l-.59-.59L14 16.78l-.07-.07L6.58 9.4L5.31 8.14a5.68 5.68 0 0 0 0 .59v4.67l-1.8 1.81A1.64 1.64 0 0 0 4.64 18H8v.34A3.84 3.84 0 0 0 12 22a3.88 3.88 0 0 0 4-3.22zM14 18.34A1.88 1.88 0 0 1 12 20a1.88 1.88 0 0 1-2-1.66V18h4zM7.13 4.3l1.46 1.46l9.53 9.53l2 2l.31.3a1.58 1.58 0 0 0 .45-.6a1.62 1.62 0 0 0-.35-1.78l-1.8-1.81V8.94a6.86 6.86 0 0 0-5.83-6.88a6.71 6.71 0 0 0-5.32 1.61a6.88 6.88 0 0 0-.58.54zm13.58 14.99L19.41 18l-2-2l-9.52-9.53L6.42 5L4.71 3.29a1 1 0 0 0-1.42 1.42L5.53 7l1.75 1.7l7.31 7.3l.07.07L16 17.41l.59.59l2.7 2.71a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42z" fill="${encodeURIComponent(
              '#fff'
            )}"></path></svg>');
        }
    }
`
);

const SwitchTrack = styled('span')(
  ({ theme }) => `
    background-color: ${theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be'};
    border-radius: 10px;
    width: 100%;
    height: 100%;
    display: block;
    `
);

function MUISwitch(props) {
  const { getInputProps, checked, disabled, focusVisible } = useSwitch(props);

  const stateClasses = {
    checked,
    disabled,
    focusVisible
  };

  return (
    <SwitchRoot className={clsx(stateClasses)}>
      <SwitchTrack>
        <SwitchThumb className={clsx(stateClasses)} checked={checked} />
      </SwitchTrack>
      <SwitchInput {...getInputProps()} aria-label="Notification switch" />
    </SwitchRoot>
  );
}

export default function UseSwitchesCustom() {
  return <MUISwitch defaultChecked />;
}
