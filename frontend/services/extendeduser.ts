import resolveEndpoint from "@/services/resolveEndpoint";

//contains some relevant user data for config purposes, doesn't include pfpbackground color and stuff atm, can add if needed
export interface ExtendedUser
{
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  position: string;
  pfp: string;
  isDarkMode: boolean;
}

const API_URL = resolveEndpoint("/api/");


export async function loadExtendedProfile(token: string, role: string): Promise<ExtendedUser>
{
  try
  {
    const resMe = await fetch(`${API_URL}users/detailed-user-info/`,
    {
      headers: { Authorization: `Token ${token}` },
    });
    if(!resMe.ok) throw new Error(`HTTP error! status: ${resMe.status}`)
    const me = await resMe.json();
    return {
      id: me.id,
      username: me.username,
      first_name: me.first_name,
      last_name: me.last_name,
      email: me.email,
      role: role,
      position: me.position,
      pfp: me.profilePicture,
      isDarkMode: me.isDarkMode,
    } as ExtendedUser;


  }
  catch (err)
  {
    console.error("Failed to fetch user: ", err)
    throw err;
  }
}

export const defaultExtendedUser: ExtendedUser = {
  id: 0,
  username: 'alexrivera',
  first_name: 'Alex',
  last_name: 'Rivera',
  email: 'alexrivera@gmail.com',
  role: 'Student',
  position: 'Midfielder',
  pfp: 'sometext.png',
  isDarkMode: false,
};
