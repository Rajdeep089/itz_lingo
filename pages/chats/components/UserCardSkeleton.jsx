const UserCardSkeleton = () => (
    <div className="card card-side bg-base-100 shadow-xl p-2 gap-2 animate-pulse">
      <div className="avatar">
        <div className="w-12 h-12 rounded bg-gray-300"></div>
      </div>
      <div className='flex flex-row justify-between items-start w-full'>
        <div>
          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="h-3 bg-gray-300 rounded w-10"></div>
      </div>
    </div>
  );

export default UserCardSkeleton;