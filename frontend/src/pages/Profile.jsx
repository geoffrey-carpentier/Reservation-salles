import { useAuth } from "../hooks/useAuth.js";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Mon profil
      </h1>
      <div className="card space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Prénom</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{user?.firstname}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Nom</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{user?.lastname}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
