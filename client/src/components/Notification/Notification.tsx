// import React, { FC, useEffect, useState } from 'react';

// import { NotificationWrapper } from './styled';
// interface INotification {
//   message: string;
//   isSuccess?: boolean;
//   handleClose: () => void;
// }

// const Notification: FC<INotification> = ({ message, isSuccess, handleClose }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//     const timeout = setTimeout(() => {
//       setIsVisible(false);
//       setTimeout(() => {
//         handleClose();
//       }, 1000);
//     }, 5000);
//     return () => clearTimeout(timeout);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <NotificationWrapper isVisible={isVisible} isSuccess={!!isSuccess}>
//       <div>{message}</div>
//     </NotificationWrapper>
//   );
// };

// export default Notification;

// Notification.tsx
// Notification.tsx

import React, { FC, useEffect, useState } from 'react';
import './styled.css';

interface INotification extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  isSuccess?: boolean;
  handleClose: () => void;
}

const Notification: FC<INotification> = ({ message, isSuccess, handleClose, ...rest }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        handleClose();
      }, 1000);
    }, 5000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`NotificationWrapper ${isVisible ? '' : 'slideOut'}`} {...rest}>
      <div>{message}</div>
    </div>
  );
};

export default Notification;
