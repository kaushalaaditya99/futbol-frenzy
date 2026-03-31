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

export async function loadExtendedProfile(API_URL: string, token: string, role: string): Promise<ExtendedUser>
{
  try
  {
    const resMe = await fetch(`${API_URL}api/users/detailed-user-info/`,
    {
      headers: { Authorization: `Token ${token}` },
    });
    if(!resMe.ok) throw new Error(`HTTP error! status: ${resMe.status}`)
    const me = await resMe.json();
    return me.map((d: any) => ({
      id: d.id,
      username: d.username,
      first_name: d.first_name,
      last_name: d.last_name,
      email: d.email,
      role: role,
      position: d.position,
      pfp: d.profilePicture,
      isDarkMode: d.isDarkMode,
    }));

  }
  catch (err)
  {
    console.error("Failed to fetch user: ", err)
    throw err;
  }
}
