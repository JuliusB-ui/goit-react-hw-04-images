import { useState } from 'react';

export const useToggle = () => {
  const [showModal, setShowModal] = useState(false);

  const toggle = () => setShowModal(!showModal);

  return { showModal, toggle };
};
