import React from 'react';

interface LoginButtonProps {
  isLogin: boolean,
  setLogin: (status: boolean) => void
}

function LoginButton(props: LoginButtonProps) {

  return (

    <button className="login-button">
      <span className="login-text">Đăng nhập</span>
    </button>
  );
}

export { LoginButton };
