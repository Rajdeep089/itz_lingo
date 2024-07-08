import React from 'react';

const UserCard = ({ users, setConvoId }) => {
  const user = users;

  const handleClick = () => {
    if (user) {
      setConvoId({
        userId: user.user.id,
        convoId: user.conversationId,
        name: user.user?.name,
        photo: user?.profilePhoto ? user.profilePhoto : "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?w=740&t=st=1717239089~exp=1717239689~hmac=a9d545fd4d72cf1418c9d0085aa91c7f6c60bd4d8e2fe84d5dd5a94e2350dc4d",
      });
    }
  };

  return (
    <div onClick={handleClick} className="card card-side bg-base-100 shadow-xl p-2 gap-2 cursor-pointer">
      <div className="avatar">
        <div className="w-12 rounded">
          <img src={user?.profilePhoto ? user.profilePhoto : "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?w=740&t=st=1717239089~exp=1717239689~hmac=a9d545fd4d72cf1418c9d0085aa91c7f6c60bd4d8e2fe84d5dd5a94e2350dc4d"} alt="profile" />
        </div>
      </div>
      <div className='flex flex-row justify-between items-start w-full'>
        <div>
          <h2 className="font-bold text-lg">{user.user?.name}</h2>
          <p>Last Message</p>
        </div>
        <p className="text-xs opacity-50 text-end mt-1">time</p>
      </div>
    </div>
  );
};

export default UserCard;
