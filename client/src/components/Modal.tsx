import React from 'react';
import styled from 'styled-components';
import Button from './button/Button';

type ModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
  invalid: boolean;
  message: string;
};

const Modal: React.FC<ModalProps> = ({
  children,
  message,
  onConfirm,
  onCancel,
  invalid,
}) => {
  const handleConfirm = () => {
    if (invalid) {
      onCancel();
    }
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <ModalContainer>
      <p>{message}</p>
      <ButtonContainer>
        <Button onClick={handleConfirm}>확인</Button>
        {!invalid && <Button onClick={handleCancel}>다시 쓸래요</Button>}
      </ButtonContainer>
    </ModalContainer>
  );
};

export default Modal;

const ButtonContainer = styled.div`
  margin-top: 2rem;

  > button {
    margin: 0 0.3rem;
  }
`;

const ModalContainer = styled.div`
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  background-color: white;
  padding: 1rem;
  text-align: center;
  width: 30rem;
  z-index: 11;
  position: fixed;
  top: 25vh;
  left: calc(50% - 15rem);

  > p {
    font-size: 1.2rem;
  }
`;
