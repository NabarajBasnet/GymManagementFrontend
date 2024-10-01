
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';


const AdminDashboard = () => {
    const { user, error, isLoading } = useUser();
    console.log('User : ',user)

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  
    return (
        <div>
                 user && (
          <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
      )
 
            <h1>Admin Dashboard In Next JS</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, obcaecati ducimus a, corrupti repudiandae consectetur voluptate dolor magni officia in deleniti error vero, necessitatibus at. Sunt pariatur repellendus nesciunt voluptates!</p>
        </div>
    )
}

export default AdminDashboard
