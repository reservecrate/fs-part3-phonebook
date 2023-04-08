const Notification = ({ notification }) => {
  const { styles, message } = notification;
  if (message === '') return null;
  return (
    <div style={styles}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
